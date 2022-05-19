package it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.JwtUtils
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.Role
import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.bodyToFlow
import org.springframework.web.reactive.function.client.exchangeToFlow
import reactor.core.publisher.Mono
import java.time.LocalDate
import java.time.Period
import java.util.*

@RestController
class TicketCatalogueController(
    val ticketCatalogueService: TicketCatalogueService,
    val orderRepository: OrderRepository
) {

    private val travelerClient = WebClient.create("http://localhost:8081")

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    @GetMapping("/orders")
    suspend fun getOrders(@RequestHeader("Authorization") jwt: String): ResponseEntity<Any> {
        val newToken = jwt.replace("Bearer", "")
        return try {
            val orders: Flow<Order> = ticketCatalogueService.getOrders(newToken)
            ResponseEntity(orders, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/orders/{orderId}")
    suspend fun getOrdersByUUID(
        @PathVariable orderId: UUID,
        @RequestHeader("Authorization") jwt: String
    ): ResponseEntity<Any> {
        val newToken = jwt.replace("Bearer", "")
        return try {
            val orders: Order = ticketCatalogueService.getOrderByUUID(orderId, newToken)
            ResponseEntity(orders, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/tickets")
    suspend fun getTickets(@RequestHeader("Authorization") jwt: String): ResponseEntity<Any> {
        return try {
            val ticketCatalogue = ticketCatalogueService.getCatalogue()
            ResponseEntity(ticketCatalogue, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }

    }

    //TODO VA BENE FARE RESPONSE ENTITY DI ANY?

    //TicketId sia nella richiesta del path che nel body?
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @PostMapping("/shop/{ticketId}")
    suspend fun buyTickets(
        @PathVariable ticketId: Long,
        @RequestHeader("Authorization") jwt: String,
        @RequestBody purchasingInfo: PurchasingInfo
    ): ResponseEntity<Any> = coroutineScope {

        var isValid = true
        val ticketCatalogue = ticketCatalogueService.getTicket(ticketId)
        val username = JwtUtils.getDetailsFromJwtToken(jwt, key).username

        if (ticketCatalogue.maxAge != null || ticketCatalogue.minAge != null) {

            val traveler = async {
                travelerClient
                    .get()
                    .uri("/my/profile")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .awaitBody<UserDetailDTO>()
            }

            val age = Period.between(LocalDate.parse(traveler.await().date_of_birth), LocalDate.now()).years

            isValid =
                (ticketCatalogue.maxAge != null && age <= ticketCatalogue.maxAge) && (ticketCatalogue.minAge != null && ticketCatalogue.minAge <= age)
        }

        if (isValid) {
            //mettere PENDING IN ORDER, poi mando al payment service, cambiare status ordine a seconda se va a buon fine o meno, se va a buon fine aggiungere in db nei ticketpurchased
            val order = orderRepository.save(
                Order(
                    UUID.randomUUID(),
                    Status.PENDING,
                    ticketId,
                    purchasingInfo.numberOfTickets,
                    username
                )
            )
            //todo -> inviare richiesta al payement service
            ResponseEntity( order.orderId, HttpStatus.OK)
        } else {
            ResponseEntity("not permitted",HttpStatus.BAD_REQUEST)
        }

    }


}

data class ErrorMessage(val error: String?)

data class PaymentInfo(
    val creditCardNumber: String,
    val expirationDate: String,
    val cvv: String,
    val cardHolder: String
)

data class PurchasingInfo(val numberOfTickets: Int, val ticketId: Long, val paymentInfo: PaymentInfo)

data class UserDetailDTO(
    val username: String,
    val name: String?,
    val surname: String?,
    val address: String?,
    val date_of_birth: String?,
    val telephone_number: String?,
    val role: Role
)