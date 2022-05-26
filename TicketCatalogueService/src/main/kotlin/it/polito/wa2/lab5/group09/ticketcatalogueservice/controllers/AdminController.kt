package it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.reactive.function.client.WebClient

@RestController
class AdminController(
    val ticketCatalogueService: TicketCatalogueService,
    val ticketCatalogueRepository: TicketCatalogueRepository,
    val orderRepository: OrderRepository
    ) {



    @PostMapping("/admin/tickets")
    suspend fun addTicketToCatalogue(
        @RequestHeader("Authorization") jwt:String,
        @RequestBody ticket : TicketCatalogue
    ): ResponseEntity<Any> {
        return try {
            if(ticket.minAge!=null && ticket.maxAge !=null && ticket.minAge > ticket.maxAge){
                throw IllegalArgumentException("Max age should be greater than Min age")
            }
            if(ticket.price<=0){
                throw IllegalArgumentException("Price should be a positive number")
            }
            ticketCatalogueRepository.save(ticket)
            ResponseEntity("Ticket added to catalogue", HttpStatus.CREATED)
        } catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/orders")
    suspend fun getAllUsersOrders(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any> {
        return try {
            val orders = ticketCatalogueService.getAllUsersOrders()
            ResponseEntity(orders,HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }

    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/orders/{userId}")
    suspend fun getUserOrders(@PathVariable userId:String, @RequestHeader("Authorization") jwt:String ) : ResponseEntity<Any>{
        return try {
            val orders = ticketCatalogueService.getUserOrders(userId)
            ResponseEntity(orders,HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }


}
