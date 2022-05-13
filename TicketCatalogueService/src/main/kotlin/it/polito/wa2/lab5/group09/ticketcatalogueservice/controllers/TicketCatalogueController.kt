package it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import kotlinx.coroutines.flow.Flow
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class TicketCatalogueController(val orderRepository: OrderRepository) {

    @GetMapping("/orders")
    suspend fun getOrders(@RequestHeader("Authorization") jwt:String) : Flow<Order> {
        return orderRepository.findByCustomerUsername("") //TODO replicare filtri token?
    }
    @GetMapping("/orders/{orderId}")
    suspend fun getOrders(@PathVariable orderId: UUID, @RequestHeader("Authorization") jwt:String) : Order? {

        //verificare che l'orderId inserito appartenga a quello specifico utente
        return orderRepository.findById(orderId) //TODO replicare filtri token?
    }



}