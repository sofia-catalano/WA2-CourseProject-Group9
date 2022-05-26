package it.polito.wa2.lab5.group09.ticketcatalogueservice

import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.TicketCatalogueRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ServiceTests {

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Autowired
    lateinit var ticketCatalogueRepository: TicketCatalogueRepository



}
