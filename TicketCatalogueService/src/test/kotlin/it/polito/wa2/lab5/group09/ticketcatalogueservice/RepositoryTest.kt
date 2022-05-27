package it.polito.wa2.lab5.group09.ticketcatalogueservice

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.last
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class RepositoryTest {

    @Autowired
    lateinit var ticketCatalogueRepository: TicketCatalogueRepository
    @Autowired
    lateinit var orderRepository: OrderRepository

    private final val ticketCatalogueEntity = TicketCatalogue(
        type = "testType",
        price = 1F,
        zones = "testZones",
        minAge = 1,
        maxAge = 18
    )

    private final val orderEntity = Order(
        ticketCatalogueId = 1,
        quantity = 3,
        customerUsername = "usernameTest"
    )

    @BeforeEach
    fun createTicketCatalogueAndOrder(){
        runBlocking {
            ticketCatalogueRepository.save(ticketCatalogueEntity).also {
                orderRepository.save(orderEntity)
            }
        }
    }

    @Test
     fun ticketCatalogueAndOrderExist(){
        runBlocking {
            val ticketCatalogueFound = ticketCatalogueRepository.findAll().last()
            val orderFound = orderRepository.findByCustomerUsername(orderEntity.customerUsername).first()

            Assertions.assertEquals(ticketCatalogueEntity.type, ticketCatalogueFound.type)
            Assertions.assertEquals(ticketCatalogueEntity.price, ticketCatalogueFound.price)
            Assertions.assertEquals(ticketCatalogueEntity.zones, ticketCatalogueFound.zones)
            Assertions.assertEquals(ticketCatalogueEntity.type, ticketCatalogueFound.type)
            Assertions.assertEquals(ticketCatalogueEntity.maxAge, ticketCatalogueFound.maxAge)
            Assertions.assertEquals(ticketCatalogueEntity.minAge, ticketCatalogueFound.minAge)

            Assertions.assertEquals(orderEntity.customerUsername, orderFound.customerUsername)
            Assertions.assertEquals(orderEntity.ticketCatalogueId, orderFound.ticketCatalogueId)
            Assertions.assertEquals(orderEntity.status, orderFound.status)
            Assertions.assertEquals(orderEntity.quantity, orderFound.quantity)




        }
    }

    @Test
    fun updateTicketCatalogue(){
        runBlocking {
            val ticketCatalogueUpdated = ticketCatalogueRepository.findAll().last().also {
                it.price = 2F
                it.zones = "DEF"
                it.type = "updatedTestType"
                ticketCatalogueRepository.save(it)
            }
            val ticketCatalogueFound = ticketCatalogueRepository.findById(ticketCatalogueUpdated.ticketId!!)

            Assertions.assertEquals(2F, ticketCatalogueFound!!.price)
            Assertions.assertEquals("DEF", ticketCatalogueFound.zones)
            Assertions.assertEquals("updatedTestType", ticketCatalogueFound.type)

        }
    }

    @Test
    fun updateOrderStatus(){
        runBlocking {
            val orderUpdated = orderRepository.findAll().last().also {
                it.status = Status.ACCEPTED
                orderRepository.save(it)
            }
            val orderFound = orderRepository.findById(orderUpdated.orderId!!)

            Assertions.assertEquals(Status.ACCEPTED, orderFound!!.status)
        }
    }

    @Test
    fun getAllUsersOrders(){
        runBlocking {
            val userOrders = orderRepository.findAll()
            Assertions.assertEquals(userOrders.count(), 1)
        }
    }

    @Test
    fun getOrderByCustomerUsername(){
        runBlocking {
            val orderFound = orderRepository.findByCustomerUsername(orderEntity.customerUsername)
            Assertions.assertEquals(orderEntity.customerUsername, orderFound.first().customerUsername)
        }
    }

    @AfterEach
     fun deleteTicketCatalogueAndOrder() {
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


