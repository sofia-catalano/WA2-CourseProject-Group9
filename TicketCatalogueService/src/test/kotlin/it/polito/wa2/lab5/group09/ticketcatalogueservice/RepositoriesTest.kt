package it.polito.wa2.lab5.group09.ticketcatalogueservice

import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class RepositoriesTest {
    @Autowired
    lateinit var orderRepository: OrderRepository

    @Test
    fun getAllUsersOrders(){
        val userOrders = orderRepository.findAll()
    }

}