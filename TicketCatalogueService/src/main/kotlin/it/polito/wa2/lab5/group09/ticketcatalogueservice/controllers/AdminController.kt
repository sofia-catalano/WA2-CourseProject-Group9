package it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers

import it.polito.wa2.lab5.group09.ticketcatalogueservice.dtos.toDTO
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import kotlinx.coroutines.flow.map
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import kotlin.math.roundToInt

@RestController
class AdminController(
    val ticketCatalogueService: TicketCatalogueService,
    ) {



    @PostMapping("/catalogue/admin/tickets")
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
            ticket.price = ((ticket.price * 100.00).roundToInt() / 100.00)
            ticketCatalogueService.addTicketToCatalogue(ticket)
            ResponseEntity("Ticket added to catalogue", HttpStatus.CREATED)
        } catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }
    @PutMapping("/catalogue/admin/tickets")
    suspend fun updateTicketCatalogue(@RequestHeader("Authorization") jwt:String,
                                      @RequestBody ticketUpdate: TicketCatalogue) : ResponseEntity<Any>{
        return try {
            ticketCatalogueService.updateTicket(ticketUpdate)
            ResponseEntity(HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }


    @DeleteMapping("/catalogue/admin/tickets/{ticketId}")
    suspend fun deleteTicketToCatalogue(
        @PathVariable ticketId:ObjectId,
        @RequestHeader("Authorization") jwt:String
    ): ResponseEntity<Any> {
        return try {
            ticketCatalogueService.deleteTicketToCatalogue(ticketId)
            ResponseEntity("Ticket deleted to catalogue", HttpStatus.OK)
        } catch (t: Throwable) {
            println(t)
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }



    @GetMapping("/catalogue/admin/orders")
    suspend fun getAllUsersOrders(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any> {
        return try {
            val orders = ticketCatalogueService.getAllUsersOrders().map {
                    o -> o.toDTO()
            }
            ResponseEntity(orders,HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }

    }


    @GetMapping("/catalogue/admin/orders/{userId}")
    suspend fun getUserOrders(@PathVariable userId:String, @RequestHeader("Authorization") jwt:String ) : ResponseEntity<Any>{
        return try {
            val orders = ticketCatalogueService.getUserOrders(userId).map {
                    o -> o.toDTO()
            }
            ResponseEntity(orders,HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }

}
