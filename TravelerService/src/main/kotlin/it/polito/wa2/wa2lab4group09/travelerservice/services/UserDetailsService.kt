package it.polito.wa2.wa2lab4group09.travelerservice.services

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.ActionTicket
import it.polito.wa2.wa2lab4group09.travelerservice.controllers.UserDetailsUpdate
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.Role
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.TicketPurchasedRepository
import it.polito.wa2.wa2lab4group09.travelerservice.repositories.UserDetailsRepository
import it.polito.wa2.wa2lab4group09.travelerservice.security.JwtUtils
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class UserDetailsService(val userDetailsRepository: UserDetailsRepository, val ticketPurchasedRepository: TicketPurchasedRepository) {

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
        return ticketPurchasedRepository.findAllByUserDetails(userDetails)
    }

    suspend fun buyTickets(jwt: String, actionTicket: ActionTicket): List<TicketPurchasedDTO> {
        val userDetails = getUserDetails(jwt)
        val tickets = mutableListOf<TicketPurchasedDTO>()
        if (actionTicket.quantity <=0 ) throw IllegalArgumentException("Quantity must be greater than zero")
        if (actionTicket.cmd == "buy_tickets"){
            for (i in 1..actionTicket.quantity){
                val token = Jwts.builder()
                    .setSubject(userDetails.username)
                    .setIssuedAt(Date.from(Instant.now()))
                    .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                    .signWith(Keys.hmacShaKeyFor(keyTicket.toByteArray())).compact()
                //TODO: tutti i tickets hanno scadenza un'ora indipendentemente dal tipo, fix it!
                tickets.add(ticketPurchasedRepository.save(TicketPurchased(
                    iat = Timestamp(System.currentTimeMillis()),
                    exp = Timestamp(System.currentTimeMillis() + 3600000),
                    zid = actionTicket.zones,
                    jws = token,
                    typeId = actionTicket.type,
                    userDetails = userDetails
                )).awaitFirst().toDTO())
            }
        } else throw IllegalArgumentException("action is not supported")
        return tickets
    }
}
