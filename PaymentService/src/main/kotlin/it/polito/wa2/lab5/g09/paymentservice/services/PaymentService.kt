package it.polito.wa2.lab5.g09.paymentservice.services

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import it.polito.wa2.lab5.g09.paymentservice.repositories.TransactionRepository
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class PaymentService(val transactionRepository: TransactionRepository) {
    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    suspend fun getAllUsersTransactions() : Flow<Transaction>{
        return try {
            transactionRepository.findAll()
        }catch (t : Throwable){
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getUserTransactions(userId: String): Flow<Transaction> {
        return try {
            transactionRepository.findByCustomerUsername(userId)
        }catch (t : Throwable){
            throw IllegalArgumentException("Username not found")
        }
    }

}