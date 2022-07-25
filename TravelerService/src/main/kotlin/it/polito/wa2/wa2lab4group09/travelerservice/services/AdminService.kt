package it.polito.wa2.wa2lab4group09.travelerservice.services

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.UserDetailsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AdminService(val userDetailsRepository: UserDetailsRepository, val ticketPurchasedRepository: TicketPurchasedRepository){
    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    suspend fun getTravelers(jwt:String): Flow<Username> {
        return userDetailsRepository.findAll().asFlow().map {
            Username(it.username)
        }
    }

    suspend fun getTravelerProfile(jwt:String, userID:String): UserDetails {
        return userDetailsRepository.findById(userID).awaitFirst() ?:throw IllegalArgumentException("User doesn't exist!")
    }

    suspend fun getTravelerTickets(jwt:String, userID:String): List<TicketPurchasedDTO> {
        val tickets = mutableListOf<TicketPurchasedDTO>()
        val userDetail = userDetailsRepository.findById(userID).awaitFirst()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            ticketPurchasedRepository.findAllByUserDetails(userDetail).map {
                tickets.add(TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws))
            }
            return tickets
        }
    }


}


data class Username(
    val username: String
)