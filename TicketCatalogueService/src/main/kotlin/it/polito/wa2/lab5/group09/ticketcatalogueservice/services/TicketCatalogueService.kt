package it.polito.wa2.lab5.group09.ticketcatalogueservice.services

import it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers.UserDetailDTO
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.JwtUtils
import it.polito.wa2.lab5.group09.ticketcatalogueservice.utils.PaymentResult
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.BodyInserter
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.util.*

@Service
class TicketCatalogueService(
    val orderRepository: OrderRepository,
    val ticketCatalogueRepository: TicketCatalogueRepository
) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    private val travelerClient = WebClient.create("http://localhost:8081")

    suspend fun getOrders(jwt: String): Flow<Order> {
        return orderRepository.findByCustomerUsername(JwtUtils.getDetailsFromJwtToken(jwt, key).username)
    }

    suspend fun getOrderByUUID(orderId: UUID, jwt: String): Order {
        val order = orderRepository.findById(orderId)
        if (order?.customerUsername == JwtUtils.getDetailsFromJwtToken(jwt, key).username) {
            return order
        } else {
            throw IllegalArgumentException("User not allowed")
        }
    }

    suspend fun getAllUsersOrders(): Flow<Order> {
        return try {
            orderRepository.findAll()
        } catch (t: Throwable) {
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getUserOrders(userId: String): Flow<Order> {
        return try {
            orderRepository.findByCustomerUsername(userId)
        } catch (t: Throwable) {
            throw IllegalArgumentException("Username not found")
        }
    }

    suspend fun getCatalogue(): Flow<TicketCatalogue> {
        return try {
            ticketCatalogueRepository.findAll()
        } catch (t: Throwable) {
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getTicket(ticketId: Long): TicketCatalogue {
        return try {
            ticketCatalogueRepository.findById(ticketId)!!
        } catch (t: Throwable) {
            throw IllegalArgumentException("This ticket type doesn't exist!")
        }
    }

    @Transactional
    suspend fun updateOrder(paymentResult: PaymentResult, token: String) = coroutineScope {
        try {
            println(token)
            var status = Status.ACCEPTED
            println(paymentResult)
            if (!paymentResult.confirmed) {
                status = Status.CANCELED
                throw IllegalArgumentException("Payment FAILED")
            }
            println(status)
            val order: Order = orderRepository.findById(paymentResult.orderId)!!
            order.status = status
            orderRepository.save(order)
            println("Order updated")
            val traveler = async {
                travelerClient
                    .post()
                    .uri("/my/tickets")
                    .header("Authorization", token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(ActionTicket("buy_tickets", order.quantity, "", order.ticketCatalogueId))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .awaitBody<Unit>()
            }
            println(traveler.await())

        } catch (t: Throwable) {
            throw IllegalArgumentException("This ticket type doesn't exist!")
        }
    }
}

data class ActionTicket(val cmd: String, val quantity: Int, val zones: String, val type: Long)