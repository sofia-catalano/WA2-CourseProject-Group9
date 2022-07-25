package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TicketPurchasedRepository: ReactiveMongoRepository<TicketPurchased, ObjectId> {

    fun findAllByUserDetails(userDetails: UserDetails) : Flow<TicketPurchased>

    fun deleteAllByUserDetails(userDetails: UserDetails)
}