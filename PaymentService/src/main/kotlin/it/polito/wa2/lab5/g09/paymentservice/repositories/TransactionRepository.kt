package it.polito.wa2.lab5.g09.paymentservice.repositories

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TransactionRepository: CoroutineCrudRepository<Transaction, UUID> {
    fun findByCustomerUsername(customerUsername : String) : Flow<Transaction>
}
