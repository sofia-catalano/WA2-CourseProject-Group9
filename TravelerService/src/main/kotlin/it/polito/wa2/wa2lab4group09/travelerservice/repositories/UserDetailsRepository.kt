package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.Role
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface UserDetailsRepository: ReactiveMongoRepository<UserDetails, String> {

    fun findAllByRole(role: Role): Flux<UserDetails>

}
