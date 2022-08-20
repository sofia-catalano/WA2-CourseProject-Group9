package it.polito.wa2.wa2lab4group09.travelerservice.services

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ActionTicket
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ActionTravelcard
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.UserDetailsUpdate
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
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import reactor.kotlin.adapter.rxjava.toFlowable
import reactor.kotlin.adapter.rxjava.toFlux
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class UserDetailsService(val userDetailsRepository: UserDetailsRepository,
                         val ticketPurchasedRepository: TicketPurchasedRepository,
                         val travelcardPurchasedRepository: TravelcardPurchasedRepository,
                         val travelcardOwnerRepository: TravelcardOwnerRepository ) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    @Value("\${application.jwt.jwtSecretTicket}")
    lateinit var keyTicket : String

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
                    .setExpiration(exp)
                    .signWith(Keys.hmacShaKeyFor(keyTicket.toByteArray())).compact()
                tickets.add(ticketPurchasedRepository.save(TicketPurchased(
                    iat = Timestamp(System.currentTimeMillis()),
                    exp = Timestamp.from(exp.toInstant()),
                    zid = actionTicket.zones,
                    jws = token,
                    typeId = actionTicket.typeId,
                    userId = userDetails.username
                )).awaitFirst().toDTO())
            }
        } else throw IllegalArgumentException("action is not supported")
        return tickets
    }

    suspend fun getUserTravelcards(jwt:String): Flow<TravelcardPurchased> {
        val userDetails = getUserDetails(jwt)
        return travelcardPurchasedRepository.findAllByUserIdOrderByIat(userDetails.username).asFlow()
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

            return travelcardPurchasedRepository.save(TravelcardPurchased(
                iat = Timestamp(System.currentTimeMillis()),
                exp = Timestamp.from(exp.toInstant()),
                zid = actionTravelcard.zones,
                jws = token,
                typeId = actionTravelcard.typeId,
                userId = userDetails.username,
                ownerId = actionTravelcard.owner.fiscal_code
            )).awaitFirst().toDTO()
        } else throw IllegalArgumentException("Action is not supported")
    }

}
