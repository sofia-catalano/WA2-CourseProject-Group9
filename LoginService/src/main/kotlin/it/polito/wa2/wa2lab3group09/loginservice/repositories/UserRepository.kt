package it.polito.wa2.wa2lab3group09.loginservice.repositories

import it.polito.wa2.wa2lab3group09.loginservice.entities.Role
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Repository
interface UserRepository: ReactiveMongoRepository<User, ObjectId> {
    fun getByUsername(username: String): Mono<User?>
    fun getByEmail(email: String): Mono<User?>
    fun findAllByRole(role: Role): Flux<User>
}