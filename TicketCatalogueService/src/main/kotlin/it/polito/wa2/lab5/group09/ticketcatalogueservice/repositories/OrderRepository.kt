package it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository: ReactiveMongoRepository<Order, ObjectId> {

    fun findByCustomerUsername(customerUsername : String) : Flow<Order>

}