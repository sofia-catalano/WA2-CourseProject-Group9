package it.polito.wa2.lab5.group09.ticketcatalogueservice

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.Role
import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.last
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.context.support.WithMockUser
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@SpringBootTest
class ServiceTest {
    @Autowired
    lateinit var ticketCatalogueRepository: TicketCatalogueRepository
    @Autowired
    lateinit var orderRepository: OrderRepository
    @Autowired
    lateinit var ticketCatalogueService : TicketCatalogueService
    private final var _keyUser = "laboratorio4webapplications2ProfessorGiovanniMalnati"
    private final val ticketCatalogue =
        TicketCatalogue(
            type = "Seasonal",
            price = 30.0f,
            zones = "ABC",
            maxAge = 100,
            minAge = 10)
    private final val order = Order(status = Status.PENDING, ticketCatalogueId = 1, quantity = 1, customerUsername = "usernameTest")

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
     fun createTicketCatalogueAndOrder(){
        runBlocking {
            ticketCatalogueRepository.save(ticketCatalogue)
            orderRepository.save(order)
        }
    }

    @Test
    @WithMockUser(username = "usernameTest", password = "pwd", roles = ["CUSTOMER"])
    fun getOrders(){
        runBlocking {
            val orders = ticketCatalogueService.getOrders(generateUserToken(_keyUser))
            Assertions.assertEquals(orders.count(),1)
        }
    }
    @Test
    @WithMockUser(username = "usernameTest", password = "pwd", roles = ["CUSTOMER"])
    fun getOrderByUUID(){
        runBlocking {
            lateinit var orderId : UUID
            orderRepository.findAll().collect {  orderId = it.orderId!! }
            val order = ticketCatalogueService.getOrderByUUID(orderId, generateUserToken(_keyUser))
            Assertions.assertEquals(order.orderId,orderId)
        }
    }

    @Test
    @WithMockUser(username = "usernameTest", password = "pwd", roles = ["CUSTOMER"])
    fun getOrderByUUIDNotAllowed(){
            Assertions.assertThrows(IllegalArgumentException::class.java){
                runBlocking {
                    lateinit var orderId : UUID
                    orderRepository.findAll().collect {  orderId = it.orderId!! }
                    ticketCatalogueService.getOrderByUUID(orderId, generateAdminToken(_keyUser))
                }
            }
    }

    @Test
    @WithMockUser(username = "usernameTest", password = "pwd", roles = ["CUSTOMER"])
    fun getCatalogue(){
        runBlocking {
            val catalogue = ticketCatalogueService.getCatalogue()
            Assertions.assertEquals(catalogue.count(),1)
        }
    }

    //TODO FAI LA SHOP

    @AfterEach
    fun deleteTicketCatalogueAndOrder(){
        runBlocking {
            ticketCatalogueRepository.findAll().last().also {
                ticketCatalogueRepository.delete(it)
            }
            orderRepository.findAll().last().also {
                orderRepository.delete(it)
            }
        }
    }
}