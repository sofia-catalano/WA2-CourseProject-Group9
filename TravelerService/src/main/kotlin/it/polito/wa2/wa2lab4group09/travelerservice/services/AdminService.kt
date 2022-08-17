package it.polito.wa2.wa2lab4group09.travelerservice.services

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
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
class AdminService(val userDetailsRepository: UserDetailsRepository, val ticketPurchasedRepository: TicketPurchasedRepository){
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
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
            }

    }
    suspend fun getTicketsPurchasedPeriodOfTime(start: String, end:String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByIatBetween(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
            }
    }
      suspend fun getTicketsValidated():Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository
            .findByValidate()
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
            }
    }
    suspend fun getTicketsValidatedPeriodOfTime(start: String, end:String): Flow<TicketPurchasedDTO> {
        return ticketPurchasedRepository.
        findByValidateAndPeriodOfTime(convertDateToTimestamp(start),convertDateToTimestamp(end))
            .map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
            }
    }

    suspend fun getTravelerProfile(jwt:String, userID:String): UserDetails {
        return userDetailsRepository.findById(userID).awaitFirstOrNull() ?:throw IllegalArgumentException("User doesn't exist!")
    }

    suspend fun getTravelerTickets(userID:String): Flow<TicketPurchasedDTO> {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository.findAllByUserDetails(userDetail).map {
                TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
            }
        }
    }


   suspend fun getTravelerTicketsPurchasedPeriodOfTime(userID: String, startTime:String, endTime:String):Flow<TicketPurchasedDTO> {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findByUserDetailsAndIatBetween(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime),userDetail)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
                }
        }
    }

    suspend fun getTravelerTicketsValidated(userID:String): Flow<TicketPurchasedDTO>  {
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidatedByUserDetails(userDetail)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
                }
        }
    }

    suspend fun getTravelerTicketsValidatedPeriodOfTime(userID: String, startTime:String, endTime:String): Flow<TicketPurchasedDTO>  {
        val tickets = mutableListOf<TicketPurchasedDTO>()
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            return ticketPurchasedRepository
                .findAllValidatedByUserDetailsAndPeriodOfTime(convertDateToTimestamp(startTime),convertDateToTimestamp(endTime), userDetail)
                .map {
                    TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws, it.validated)
                }
        }
    }

}


data class Username(
    val username: String
)
