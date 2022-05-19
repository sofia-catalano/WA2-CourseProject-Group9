package it.polito.wa2.lab5.group09.ticketcatalogueservice.services

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.JwtUtils
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.util.*

@Service
class TicketCatalogueService(val orderRepository: OrderRepository, val ticketCatalogueRepository: TicketCatalogueRepository) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    suspend fun getOrders(jwt : String) : Flow<Order> {
        return orderRepository.findByCustomerUsername(JwtUtils.getDetailsFromJwtToken(jwt,key).username)
    }

    suspend fun getOrderByUUID(orderId: UUID, jwt: String): Order {
        val order =  orderRepository.findById(orderId)
        if(order?.customerUsername == JwtUtils.getDetailsFromJwtToken(jwt,key).username){
            return order
        } else {
            throw IllegalArgumentException("User not allowed")
        }
    }

    suspend fun getAllUsersOrders() : Flow<Order>{
        return try {
            orderRepository.findAll()
        }catch (t : Throwable){
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getUserOrders(userId: String): Flow<Order> {
        return try {
            orderRepository.findByCustomerUsername(userId)
        }catch (t : Throwable){
            throw IllegalArgumentException("Username not found")
        }
    }

    suspend fun getCatalogue() : Flow<TicketCatalogue>{
        return try {
            ticketCatalogueRepository.findAll()
        }catch (t : Throwable){
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getTicket(ticketId : Long): TicketCatalogue {
        return try {
            ticketCatalogueRepository.findById(ticketId)!!
        }catch (t : Throwable){
            throw IllegalArgumentException("This ticket type doesn't exist!")
        }
    }
}