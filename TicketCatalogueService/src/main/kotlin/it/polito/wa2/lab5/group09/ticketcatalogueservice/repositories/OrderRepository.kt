package it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrderRepository: CoroutineCrudRepository<Order, UUID> {

    fun findByCustomerUsername(customerUsername : String) : Flow<Order>

}