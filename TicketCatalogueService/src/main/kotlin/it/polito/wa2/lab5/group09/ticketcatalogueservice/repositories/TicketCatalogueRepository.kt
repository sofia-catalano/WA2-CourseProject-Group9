package it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories

import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface TicketCatalogueRepository: ReactiveMongoRepository<TicketCatalogue, ObjectId>{

    fun findByType(type: String): Mono<TicketCatalogue?>
}