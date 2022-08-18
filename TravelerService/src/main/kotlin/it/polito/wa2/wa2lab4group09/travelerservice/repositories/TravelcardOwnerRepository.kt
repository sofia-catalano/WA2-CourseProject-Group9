package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardOwner
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface TravelcardOwnerRepository: ReactiveMongoRepository<TravelcardOwner, String> {
}