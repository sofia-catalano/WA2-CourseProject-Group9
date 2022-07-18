package it.polito.wa2.wa2lab3group09.loginservice.repositories

import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.time.LocalDateTime


@Repository
interface ActivationRepository: ReactiveMongoRepository<Activation, ObjectId> {

    suspend fun getByUser(user : User) : Activation?

    suspend fun getById(id: ObjectId): Activation?
/*
    @Query("select A.user from Activation A where A.id = :uuid")
    fun getUserByUUID (uuid: UUID) : User


    @Transactional
    @Modifying
    @Query("update Activation set attemptCounter = attemptCounter - 1 where id = :uuid")
    fun reduceAttempt (uuid: UUID)

    @Query("select user.id from Activation where expirationDate < CURRENT_TIMESTAMP ")
    fun getExpiredUserIDs(): List<Long>
    */

    @Query("{ expirationDate: { \$lt: ?0 }}")
    fun getExpiredUserIDs(date: LocalDateTime = LocalDateTime.now()): Flux<ObjectId>


}