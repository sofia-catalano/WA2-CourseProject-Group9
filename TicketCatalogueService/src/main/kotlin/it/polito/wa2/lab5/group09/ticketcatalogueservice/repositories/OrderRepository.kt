package it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import kotlinx.coroutines.flow.Flow
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface OrderRepository: CoroutineCrudRepository<Order, UUID> {

    fun findByCustomerUsername(customerUsername : String) : Flow<Order>

    @Modifying
    @Query("UPDATE \"ticketCatalogue\".public.orders SET status =:status where order_id = :orderId")
    fun updateOrderStatus(orderId : UUID, status: Status)
}