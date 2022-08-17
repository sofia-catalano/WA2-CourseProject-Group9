package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.Query

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.sql.Timestamp

@Repository
interface TravelcardPurchasedRepository: ReactiveMongoRepository<TravelcardPurchased, ObjectId> {

    fun findAllByOwnerIdOrderByIat(userId: String) : Flux<TravelcardPurchased>

    fun deleteAllByOwnerId(ownerId: String)

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findByIatBetween(start: Timestamp, end: Timestamp): Flow<TravelcardPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1 },'ownerId' : { \$eq: ?2}}")
    fun findByOwnerAndIatBetween(start:Timestamp, end: Timestamp, ownerId : String): Flow<TravelcardPurchased>

}