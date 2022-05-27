package it.polito.wa2.lab5.g09.paymentservice

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import it.polito.wa2.lab5.g09.paymentservice.repositories.TransactionRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.last
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.sql.Timestamp
import java.util.*

@SpringBootTest
class RepositoryTest {

    @Autowired
    lateinit var transactionRepository: TransactionRepository

    private val transactionEntity = Transaction(
        amount = 10.0F,
        customerUsername = "usernameTest",
        orderId =  UUID.randomUUID(),
        date = Timestamp(System.currentTimeMillis()),
        isConfirmed = true
    )

    @BeforeEach
    fun createTransaction(){
        runBlocking {
            transactionRepository.save(transactionEntity)
        }
    }

    @Test
    fun getTransactionsByCustomerUsername(){
        runBlocking {
            val transactionsFound = transactionRepository.findByCustomerUsername(transactionEntity.customerUsername)
            Assertions.assertEquals(transactionEntity.customerUsername, transactionsFound.last().customerUsername)
            Assertions.assertEquals(transactionEntity.orderId, transactionsFound.last().orderId)
            Assertions.assertEquals(transactionEntity.date, transactionsFound.last().date)
            Assertions.assertEquals(transactionEntity.amount, transactionsFound.last().amount)
            Assertions.assertEquals(transactionEntity.isConfirmed, transactionsFound.last().isConfirmed)
        }
    }

    @Test
    fun getAllUsersTransactions(){
        runBlocking {
            val transactionsFound = transactionRepository.findAll()
            Assertions.assertEquals(transactionEntity.customerUsername, transactionsFound.last().customerUsername)
            Assertions.assertEquals(transactionEntity.orderId, transactionsFound.last().orderId)
            Assertions.assertEquals(transactionEntity.date, transactionsFound.last().date)
            Assertions.assertEquals(transactionEntity.amount, transactionsFound.last().amount)
            Assertions.assertEquals(transactionEntity.isConfirmed, transactionsFound.last().isConfirmed)
        }
    }

    @AfterEach
    fun deleteTransaction() {
        runBlocking {
            transactionRepository.findAll().last().also {
                transactionRepository.delete(it)
            }
        }
    }
}