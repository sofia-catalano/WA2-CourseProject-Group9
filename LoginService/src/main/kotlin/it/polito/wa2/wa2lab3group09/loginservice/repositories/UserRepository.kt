package it.polito.wa2.wa2lab3group09.loginservice.repositories

import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional


@Repository
interface UserRepository: ReactiveMongoRepository<User, ObjectId> {
    suspend fun getByUsername(username: String): User?
    suspend fun getByEmail(email: String): User?

}