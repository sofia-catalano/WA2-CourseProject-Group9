package it.polito.wa2.lab5.g09.paymentservice

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import it.polito.wa2.lab5.g09.paymentservice.repositories.TransactionRepository
import it.polito.wa2.lab5.g09.paymentservice.security.Role
import it.polito.wa2.lab5.g09.paymentservice.services.PaymentService

import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.last
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.context.support.WithMockUser
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@SpringBootTest
class ServiceTest {
    @Autowired
    lateinit var transactionRepository: TransactionRepository
    @Autowired
    lateinit var paymentService: PaymentService


    private final var _keyUser = "laboratorio4webapplications2ProfessorGiovanniMalnati"
    private final val transaction = Transaction(amount=10.toFloat(), customerUsername="usernameTest", orderId=UUID.randomUUID(), date= Timestamp(System.currentTimeMillis()), isConfirmed=true)

    fun generateUserToken(
        key: String,
        sub: String? = "usernameTest",
        exp: Date? = Date.from(Instant.now().plus(1, ChronoUnit.HOURS))
    ): String {
        return Jwts.builder()
            .setSubject(sub)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(exp)
            .claim("role", Role.CUSTOMER)
            .signWith(Keys.hmacShaKeyFor(key.toByteArray())).compact()
    }

    fun generateAdminToken(
        key: String,
        sub: String? = "adminUsernameTest",
        exp: Date? = Date.from(Instant.now().plus(1, ChronoUnit.HOURS))
    ): String {
        return Jwts.builder()
            .setSubject(sub)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(exp)
            .claim("role", Role.ADMIN)
            .signWith(Keys.hmacShaKeyFor(key.toByteArray())).compact()
    }

    @BeforeEach
     fun createTransaction(){
        runBlocking {
            transactionRepository.save(transaction)
        }
    }

    @Test
    @WithMockUser(username = "usernameTest", password = "pwd", roles = ["CUSTOMER"])
    fun getUserTransaction(){
        runBlocking {
            val transactions=paymentService.getUserTransactions(generateUserToken(_keyUser))
            transactions.onEach { value ->
                Assertions.assertEquals(value.customerUsername, "usernameTest")
            }
        }
    }

    @Test
    fun getAdminTransactions(){
        runBlocking {
            val transactions=paymentService.getAllUsersTransactions()
            Assertions.assertEquals(1,transactions.count())
            transactions.onEach { value ->
                Assertions.assertEquals(value.customerUsername, "usernameTest")

            }
        }
    }
    @AfterEach
    fun deleteTransactions(){
        runBlocking {
            transactionRepository.deleteAll()
        }
    }


}
