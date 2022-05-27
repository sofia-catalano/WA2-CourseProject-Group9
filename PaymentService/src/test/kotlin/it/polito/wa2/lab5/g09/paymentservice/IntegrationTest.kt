package it.polito.wa2.lab5.g09.paymentservice

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import it.polito.wa2.lab5.g09.paymentservice.repositories.TransactionRepository
import it.polito.wa2.lab5.g09.paymentservice.security.Role
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class IntegrationTest {

    companion object {

        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") { "create-drop" }

        }
    }

    @LocalServerPort
    protected final var  port = 0

    @Autowired
    lateinit var restTemplate: TestRestTemplate

    @Autowired
    lateinit var transactionRepository: TransactionRepository


    private final val transactionEntity = Transaction(
        amount = 3F,
        customerUsername = "usernameTest",
        orderId = UUID.randomUUID(),
        isConfirmed = true
    )

    private final var _keyUser = "laboratorio4webapplications2ProfessorGiovanniMalnati"

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
        sub: String? = "usernameAdminTest",
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
            transactionRepository.save(transactionEntity)
        }
    }

    @Test
    fun getAllUsersTransactionsValid(){
        runBlocking {
            val headers = HttpHeaders()
            val tkn = generateAdminToken(_keyUser)
            headers.set("Authorization", "Bearer$tkn")
            val requestEntity = HttpEntity<Unit>(headers)
            val response = restTemplate.exchange(
                "http://localhost:$port/admin/transactions", HttpMethod.GET, requestEntity, Any::class.java, Order::class.java
            )
            Assertions.assertEquals(HttpStatus.OK, response.statusCode)
        }
    }

    @Test
    fun getAllUsersTransactionsInvalid(){
        runBlocking {
            val headers = HttpHeaders()
            val tkn = generateAdminToken("129837y918273918273198723198731982739182739128273197")
            headers.set("Authorization", "Bearer$tkn")
            val requestEntity = HttpEntity<Unit>(headers)
            val response = restTemplate.exchange(
                "http://localhost:$port/admin/transactions", HttpMethod.GET, requestEntity, Any::class.java, Order::class.java
            )
            Assertions.assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        }
    }

    @Test
    fun getAllTransactionsValid(){
        runBlocking {
            val headers = HttpHeaders()
            val tkn = generateUserToken(_keyUser)
            headers.set("Authorization", "Bearer$tkn")
            val requestEntity = HttpEntity<Unit>(headers)
            val response = restTemplate.exchange(
                "http://localhost:$port/transactions", HttpMethod.GET, requestEntity, Any::class.java, Order::class.java
            )
            Assertions.assertEquals(HttpStatus.OK, response.statusCode)
        }
    }

    @Test
    fun getAllTransactionsInvalid(){
        runBlocking {
            val headers = HttpHeaders()
            val tkn = generateUserToken("129837y918273918273198723198731982739182739128273197")
            headers.set("Authorization", "Bearer$tkn")
            val requestEntity = HttpEntity<Unit>(headers)
            val response = restTemplate.exchange(
                "http://localhost:$port/transactions", HttpMethod.GET, requestEntity, Any::class.java, Order::class.java
            )
            Assertions.assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        }
    }

    @AfterEach
    fun deleteTicketCatalogueAndOrder() {
        runBlocking {
            transactionRepository.delete(transactionEntity)
        }
    }
}
