package it.polito.wa2.wa2lab4group09.travelerservice.services

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.UserDetailsDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.UserDetailsRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AdminService(val userDetailsRepository: UserDetailsRepository, val ticketPurchasedRepository: TicketPurchasedRepository){
    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    fun getTravelers(jwt:String): List<Username> {
        val travelers = mutableListOf<Username>()
        userDetailsRepository.getUsers().forEach { travelers.add(Username(it)) }
        return travelers
    }

    fun getTravelerProfile(jwt:String, userID:String): UserDetailsDTO {
        val userDetail = userDetailsRepository.findById(userID).unwrap()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else
            return userDetail.toDTO()
    }

    fun getTravelerTickets(jwt:String, userID:String): List<TicketPurchasedDTO> {
        val tickets = mutableListOf<TicketPurchasedDTO>()
        val userDetail = userDetailsRepository.findById(userID).unwrap()
        if (userDetail == null)
            throw IllegalArgumentException("User doesn't exist!")
        else{
            ticketPurchasedRepository.findByUserDetails(userDetail).forEach {
                tickets.add(TicketPurchasedDTO(it.sub, it.iat, it.exp, it.zid, it.jws))
            }
            return tickets
        }
    }


}


data class Username(
    val username: String
)