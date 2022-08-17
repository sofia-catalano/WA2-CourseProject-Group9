package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TicketPurchasedRepository: ReactiveMongoRepository<TicketPurchased, ObjectId> {

    fun findAllByUserDetailsOrderByIat(userDetails: UserDetails) : Flux<TicketPurchased>

    fun deleteAllByUserDetails(userDetails: UserDetails)
}