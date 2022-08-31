package it.polito.wa2.wa2lab4group09.travelerservice.services

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ActionTicket
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ActionTravelcard
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.UserDetailsUpdate
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ValidationToTravelerService
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TravelcardPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.*
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TravelcardOwnerRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TravelcardPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.UserDetailsRepository
import it.polito.wa2.wa2lab4group09.travelerservice.security.JwtUtils
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.Message
import org.springframework.messaging.support.MessageBuilder
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.*
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class UserDetailsService(val userDetailsRepository: UserDetailsRepository,
                         val ticketPurchasedRepository: TicketPurchasedRepository,
                         val travelcardPurchasedRepository: TravelcardPurchasedRepository,
                         val travelcardOwnerRepository: TravelcardOwnerRepository,
                         @Value("\${spring.kafka.producer.topic1}") val topic1: String,
                         @Value("\${spring.kafka.producer.topic2}") val topic2: String,
                         @Autowired
                         private val kafkaTemplate: KafkaTemplate<String, TicketPurchasedDTO>,
                         @Autowired
                         private val kafkaTemplate2: KafkaTemplate<String, TravelcardPurchasedDTO>

) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    @Value("\${application.jwt.jwtSecretTicket}")
    lateinit var keyTicket : String

    fun convertDateToTimestamp(date:String):Timestamp{
        val tmp = LocalDateTime.parse(
            date,
            DateTimeFormatter.ofPattern( "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" )
        ).toInstant( ZoneOffset.UTC)
        return Timestamp.from(tmp)
    }

    suspend fun getUserDetails(jwt : String): UserDetails {
        val username = JwtUtils.getDetailsFromJwtToken(jwt, key).username
        val role: Role = JwtUtils.getDetailsFromJwtToken(jwt, key).role
        return userDetailsRepository.findById(username).awaitFirstOrNull() ?: userDetailsRepository.save(
            UserDetails(
                username,
                role = role
            )
        ).awaitFirst()
    }



    suspend fun updateUserDetails(jwt:String, userDetailsUpdate: UserDetailsUpdate){
        val userDetails = getUserDetails(jwt)
        userDetailsRepository.save(userDetails.copy(name = userDetailsUpdate.name,
                                                    surname = userDetailsUpdate.surname,
                                                    date_of_birth = userDetailsUpdate.date_of_birth,
                                                    telephone_number = userDetailsUpdate.telephone_number,
                                                    address = userDetailsUpdate.address)).awaitFirst()
    }

    suspend fun getUserTickets(jwt:String): Flow<TicketPurchased> {
        val userDetails = getUserDetails(jwt)
        return ticketPurchasedRepository.findAllByUserIdOrderByIat(userDetails.username).asFlow()
    }
    suspend fun getUserTicketsPeriodOfTime(jwt:String, startTime:String, endTime:String): Flow<TicketPurchased> {
        val userDetails = getUserDetails(jwt)
        return ticketPurchasedRepository
            .findByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username )
    }

    suspend fun buyTickets(jwt: String, actionTicket: ActionTicket): List<TicketPurchasedDTO> {
        val userDetails = getUserDetails(jwt)
        val tickets = mutableListOf<TicketPurchasedDTO>()
        if (actionTicket.quantity <=0 ) throw IllegalArgumentException("Quantity must be greater than zero")
        if (actionTicket.cmd == "buy_tickets"){
            val exp = when (actionTicket.type) {
                "60 min" -> Date.from(Instant.now().plus(1, ChronoUnit.HOURS)) //60 min
                "90 min" -> Date.from(Instant.now().plus(90, ChronoUnit.MINUTES)) //90 min
                "120 min" -> Date.from(Instant.now().plus(90, ChronoUnit.MINUTES)) //120 min
                "1 day" -> Date.from(Instant.now().plus(1, ChronoUnit.DAYS)) //daily
                "2 day" -> Date.from(Instant.now().plus(2, ChronoUnit.DAYS)) //multidaily 2
                "3 day" -> Date.from(Instant.now().plus(3, ChronoUnit.DAYS)) //multidaily 3
                "1 week" -> Date.from(Instant.now().plus(7, ChronoUnit.DAYS)) //weekly
                else -> { // Note the block
                    throw IllegalArgumentException("Ticket type is not supported")
                }
            }

            for (i in 1..actionTicket.quantity){
                val token = Jwts.builder()
                    .setSubject(userDetails.username)
                    .setIssuedAt(Date.from(Instant.now()))
                    .setNotBefore(Date.from(Instant.now().plus(1, ChronoUnit.SECONDS)))
                    .setId(actionTicket.type) //the id of the ticket is the duration, the field in the jwts is jid
                    .signWith(Keys.hmacShaKeyFor(keyTicket.toByteArray())).compact()
                tickets.add(ticketPurchasedRepository.save(TicketPurchased(
                    iat = Timestamp(System.currentTimeMillis()),
                    zid = actionTicket.zones,
                    jws = token,
                    duration = actionTicket.type,
                    typeId = actionTicket.typeId,
                    userId = userDetails.username
                )).awaitFirst().toDTO())
            }

            //send kafka message to QRCodeService for QRCode generation
            tickets.forEach {
                log.info("Sending message to Kafka {}", it)
                val message: Message<TicketPurchasedDTO> = MessageBuilder
                    .withPayload(it)
                    .setHeader(KafkaHeaders.TOPIC, topic1)
                    .setHeader("Authorization", jwt)
                    .build()
                kafkaTemplate.send(message)
            }

        } else throw IllegalArgumentException("action is not supported")
        return tickets
    }

    suspend fun getUserTravelcards(jwt:String): Flow<TravelcardPurchased> {
        val userDetails = getUserDetails(jwt)
        return travelcardPurchasedRepository.findAllByUserIdOrderByIat(userDetails.username).asFlow()
    }

    suspend fun getUserTravelcardsValid(token: String): Flow<TravelcardPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findAllValidByUserDetails(userDetails.username, Timestamp.from(Instant.now()))
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }
    suspend fun getUserTravelcardsValidPeriodOfTime(jwt:String, startTime:String, endTime:String): Flow<TravelcardPurchased> {
        val userDetails = getUserDetails(jwt)
        return travelcardPurchasedRepository
            .findAllValidByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username, Timestamp.from(Instant.now()) )
    }


    suspend fun getUserTravelcardsExpired(token: String): Flow<TravelcardPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findAllExpiredByUserDetails(userDetails.username, Timestamp.from(Instant.now()))
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }
    suspend fun getUserTravelcardsExpiredPeriodOfTime(jwt:String, startTime:String, endTime:String): Flow<TravelcardPurchased> {
        val userDetails = getUserDetails(jwt)
        return travelcardPurchasedRepository
            .findAllExpiredByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username, Timestamp.from(Instant.now()) )
    }

    suspend fun buyTravelcards(jwt: String, actionTravelcard: ActionTravelcard): TravelcardPurchasedDTO {
        if (actionTravelcard.cmd == "buy_travelcard"){
            val userDetails = getUserDetails(jwt)
            var owner = travelcardOwnerRepository.findById(actionTravelcard.owner.fiscal_code).awaitFirstOrNull()
            if (owner == null){
                 owner = travelcardOwnerRepository.save( TravelcardOwner(
                    fiscal_code = actionTravelcard.owner.fiscal_code,
                    name = actionTravelcard.owner.name,
                    surname = actionTravelcard.owner.surname,
                    address = actionTravelcard.owner.address,
                    date_of_birth = actionTravelcard.owner.date_of_birth,
                    telephone_number = actionTravelcard.owner.telephone_number,
                )).awaitFirst()
            }else{
                //verifico che non esiste già un abbonamento uguale per quell'owner
                val travelcard = travelcardPurchasedRepository.findByOwnerIdAndTypeId(actionTravelcard.owner.fiscal_code, actionTravelcard.typeId, Timestamp.from(Instant.now())).awaitFirstOrNull()
                if(travelcard != null) {
                    throw IllegalArgumentException("Travelcard already exists for the provided owner")
                }
            }

            val exp = when (actionTravelcard.type) {
                "1 month" -> Date.from(Instant.now().plus(30, ChronoUnit.DAYS)) //monthly
                "1 year" -> Date.from(Instant.now().plus(365, ChronoUnit.DAYS)) //annual
                else -> { // Note the block
                    throw IllegalArgumentException("Travelcard type is not supported")
                }
            }

            val token = Jwts.builder()
                .setSubject(userDetails.username)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(exp)
                .signWith(Keys.hmacShaKeyFor(keyTicket.toByteArray())).compact()

            val travelcard = travelcardPurchasedRepository.save(TravelcardPurchased(
                iat = Timestamp(System.currentTimeMillis()),
                exp = Timestamp.from(exp.toInstant()),
                zid = actionTravelcard.zones,
                jws = token,
                duration = actionTravelcard.type,
                typeId = actionTravelcard.typeId,
                userId = userDetails.username,
                ownerId = actionTravelcard.owner.fiscal_code
            )).awaitFirst().toDTO()
            println(travelcard)
            //send kafka message to QRCodeService for QRCode generation
                val message: Message<TravelcardPurchasedDTO> = MessageBuilder
                    .withPayload(travelcard)
                    .setHeader(KafkaHeaders.TOPIC, topic2)
                    .setHeader("Authorization", jwt)
                    .build()
                kafkaTemplate2.send(message)
            return travelcard
        } else throw IllegalArgumentException("Action is not supported")
    }

    suspend fun checkTicket(validationToTravelerService: ValidationToTravelerService) : TicketPurchasedDTO{
        val ticketPurchased = ticketPurchasedRepository.findById(ObjectId(validationToTravelerService.ticketId)).awaitFirst()
        return if(ticketPurchased.validated == null  && ticketPurchased.zid.contains(validationToTravelerService.zid)){
            ticketPurchased.validated = Timestamp(System.currentTimeMillis())
            ticketPurchased.exp = validationToTravelerService.expiration
            ticketPurchasedRepository.save(ticketPurchased).awaitFirst().toDTO()
        }else if(ticketPurchased.exp != null && ticketPurchased.exp!! >= Timestamp(System.currentTimeMillis()) && ticketPurchased.zid.contains(validationToTravelerService.zid)){
            ticketPurchased.toDTO()
        } else if(!ticketPurchased.zid.contains(validationToTravelerService.zid)){
            throw IllegalArgumentException("You are not allowed to use this ticket in this zone!")
        } else {
            throw IllegalArgumentException("Ticket expired at ${ticketPurchased.exp}")
        }
    }

    suspend fun getUserTicketsValid(token: String): Flow<TicketPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidByUserDetails(userDetails.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }
    suspend fun getUserTicketsValidPeriodOfTime(jwt:String, startTime:String, endTime:String): Flow<TicketPurchased> {
        val userDetails = getUserDetails(jwt)
        return ticketPurchasedRepository
            .findAllValidByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username )
    }
    suspend fun getUserTicketsValidatedPeriodOfTime(jwt:String, startTime:String, endTime:String): Flow<TicketPurchased> {
        val userDetails = getUserDetails(jwt)
        return ticketPurchasedRepository
            .findValidatedByUserDetailsAndPeriodOfTime(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username )
    }
    suspend fun getUserTicketsValidated(token: String): Flow<TicketPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidatedByUserDetails(userDetails.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }

    suspend fun getUserTicketsExpired(token: String): Flow<TicketPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllExpiredByUserDetails(userDetails.username,Timestamp.from(Instant.now()))
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }
    suspend fun getUserTicketsExpiredPeriodOfTime(token: String, startTime: String, endTime: String): Flow<TicketPurchasedDTO> {
        val userDetails = getUserDetails(token)
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllExpiredByUserDetailsAndExpiredBetween(userDetails.username,convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), Timestamp.from(Instant.now()) )
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }

    //TODO: ADD TICKET VALIDATION per le travelcards SERVICE (update del campo validate)

}
