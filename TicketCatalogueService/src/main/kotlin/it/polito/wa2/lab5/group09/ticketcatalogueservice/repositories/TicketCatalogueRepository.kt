package it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface TicketCatalogueRepository: CoroutineCrudRepository<TicketCatalogue, Long>{

    fun findByType(type: String): Mono<TicketCatalogue?>
}