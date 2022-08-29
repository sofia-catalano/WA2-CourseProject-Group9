package it.polito.wa2.wa2lab4group09.travelerservice.services

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TravelcardPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TravelcardPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.UserDetailsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset


@Service
class AdminService(val userDetailsRepository: UserDetailsRepository,
                   val ticketPurchasedRepository: TicketPurchasedRepository,
                   val travelcardPurchasedRepository: TravelcardPurchasedRepository ){
    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    fun convertDateToTimestamp(date:String):Timestamp{
        val formatter = SimpleDateFormat("dd/MM/yyyy")
        val date2 = formatter.parse(date)
        return Timestamp.from(date2.toInstant())
    }

    suspend fun getTravelers(): Flow<Username> {
        return userDetailsRepository.findAll().asFlow().map {
            Username(it.username)
        }
    }
    suspend fun getTicketsPurchased(): Flux<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findAll()
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }

    }
    suspend fun getTicketsPurchasedPeriodOfTime(start: String, end:String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByIatBetween(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }
    }
    suspend fun getTicketsValidated():Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByValidated()
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }
    }
    suspend fun getTicketsValidatedPeriodOfTime(start: String, end:String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository.
        findByValidateAndPeriodOfTime(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId,it.duration)
            }
    }
    suspend fun getTicketsValid():Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByValid()
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }
    }
    suspend fun getTicketsValidPeriodOfTime(start: String, end:String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository.
        findByValidAndIatBetween(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId,it.duration)
            }
    }
    fun getTicketsExpired(): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByExpired(Timestamp.from(Instant.now()))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }
    }
    fun getTicketsExpiredPeriodOfTime(startTime: String, endTime: String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByExpiredAndExpiredBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime),Timestamp.from(Instant.now()))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
            }
    }
    suspend fun getTravelerProfile(jwt:String, userID:String): UserDetails {
        return userDetailsRepository.findById(userID).awaitFirstOrNull() ?:throw IllegalArgumentException("User doesn't exist!")
    }

    suspend fun getTravelerTickets(userID:String): Flow<TicketPurchased> {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository.findAllByUserIdOrderByIat(userDetail.username).asFlow()
        }
    }


    suspend fun getTravelerTicketsPurchasedPeriodOfTime(userID: String, startTime:String, endTime:String):Flow<TicketPurchasedDTO> {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime),userDetail.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated, it.userId, it.duration)
                }
        }
    }

    suspend fun getTravelerTicketsValidated(userID:String): Flow<TicketPurchasedDTO>  {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidatedByUserDetails(userDetail.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }

    suspend fun getTravelerTicketsValidatedPeriodOfTime(userID: String, startTime:String, endTime:String): Flow<TicketPurchasedDTO>  {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findValidatedByUserDetailsAndPeriodOfTime(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetail.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId, it.duration)
                }
        }
    }
    suspend fun getTravelerTicketsValid(userID:String): Flow<TicketPurchasedDTO>  {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidByUserDetails(userDetail.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId,it.duration)
                }
        }
    }

    suspend fun getTravelerTicketsValidPeriodOfTime(userID: String, startTime:String, endTime:String): Flow<TicketPurchasedDTO>  {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetail.username)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId, it.duration)
                }
        }
    }

    suspend fun getTravelerTicketsExpired(userID: String): Flow<TicketPurchasedDTO> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllExpiredByUserDetails(userDetails.username, Timestamp.from(Instant.now()))
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId, it.duration)
                }
        }

    }

    suspend fun getTravelerTicketsExpiredPeriodOfTime(userID: String, startTime: String, endTime: String): Flow<TicketPurchasedDTO> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllExpiredByUserDetailsAndExpiredBetween(userDetails.username, convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), Timestamp.from(Instant.now()))
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated,it.userId, it.duration)
                }
        }

    }
    suspend fun getTravelcardsPurchased(): Flux<TravelcardPurchasedDTO> {
        return travelcardPurchasedRepository
            .findAll()
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelcardsPurchasedPeriodOfTime(start: String, end:String): Flow<TravelcardPurchasedDTO> {
        return travelcardPurchasedRepository
            .findByIatBetween(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelcardsExpired(): Flow<TravelcardPurchasedDTO> {
        return travelcardPurchasedRepository
            .findExpired(Timestamp.from(Instant.now()))
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelcardsExpiredPeriodOfTime(start: String, end:String): Flow<TravelcardPurchasedDTO> {
        if (convertDateToTimestamp(end) < convertDateToTimestamp(start) )
            throw IllegalArgumentException("End date should be greater than start date!")

        if (convertDateToTimestamp(start) > Timestamp.from(Instant.now()) || convertDateToTimestamp(end) > Timestamp.from(Instant.now()))
            throw IllegalArgumentException("Selected period of time should be less than today!")

        return travelcardPurchasedRepository
            .findExpiredByIatBetween(convertDateToTimestamp(start), convertDateToTimestamp(end), Timestamp.from(Instant.now()))
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelcardsValid():Flow<TravelcardPurchasedDTO> {
        return travelcardPurchasedRepository
            .findValid(Timestamp.from(Instant.now()))
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelcardsValidPeriodOfTime(start: String, end:String): Flow<TravelcardPurchasedDTO> {
        if (convertDateToTimestamp(end) < convertDateToTimestamp(start) )
            throw IllegalArgumentException("End date should be greater than start date!")

        if (convertDateToTimestamp(end) < Timestamp.from(Instant.now()))
            throw IllegalArgumentException("Selected period of time should be greater than today!")

        return travelcardPurchasedRepository
            .findValidByIatBetween(convertDateToTimestamp(start), convertDateToTimestamp(end), Timestamp.from(Instant.now()))
            .map {
                TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
            }
    }

    suspend fun getTravelerTravelcards(userID: String): Flow<TravelcardPurchased> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository.findAllByUserIdOrderByIat(userDetails.username).asFlow()
        }
    }

    suspend fun getTravelerTravelcardsPurchasedPeriodOfTime(userID: String, startTime:String, endTime:String):Flow<TravelcardPurchasedDTO> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findByUserAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username)
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }

    suspend fun getTravelerTravelcardsExpired(userID: String):Flow<TravelcardPurchasedDTO> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findByUserAndExp(Timestamp.from(Instant.now()), userDetails.username)
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }

    suspend fun getTravelerTravelcardsExpiredPeriodOfTime(userID: String, startTime:String, endTime:String):Flow<TravelcardPurchasedDTO> {
        if (convertDateToTimestamp(endTime) < convertDateToTimestamp(startTime) )
            throw IllegalArgumentException("End date should be greater than start date!")

        if (convertDateToTimestamp(endTime) < Timestamp.from(Instant.now()))
            throw IllegalArgumentException("Selected period of time should be greater than today!")

        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findExpiredByUserAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username, Timestamp.from(Instant.now()))
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }

    suspend fun getTravelerTravelcardsValidPeriodOfTime(userID: String, startTime:String, endTime:String):Flow<TravelcardPurchasedDTO> {
        if (convertDateToTimestamp(endTime) < convertDateToTimestamp(startTime) )
            throw IllegalArgumentException("End date should be greater than start date!")

        if (convertDateToTimestamp(startTime) > Timestamp.from(Instant.now()) || convertDateToTimestamp(endTime) > Timestamp.from(Instant.now()))
            throw IllegalArgumentException("Selected period of time should be less than today!")

        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
        if (userDetails == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return travelcardPurchasedRepository
                .findAllValidByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetails.username, Timestamp.from(Instant.now()))
                .map {
                    TravelcardPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.userId, it.duration)
                }
        }
    }


    suspend fun getTravelerTravelcardsValid(userID: String):Flow<TravelcardPurchasedDTO> {
        val userDetails = userDetailsRepository.findById(userID).awaitFirstOrNull()
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


}


data class Username(
    val username: String
)
