package it.polito.wa2.lab5.g09.paymentservice.repositories

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface TransactionRepository: ReactiveMongoRepository<Transaction, ObjectId> {

    fun findByCustomerUsername(customerUsername : String) : Flow<Transaction>

}
