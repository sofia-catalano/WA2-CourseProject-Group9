package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.Query

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.sql.Timestamp

@Repository
interface TravelcardPurchasedRepository: ReactiveMongoRepository<TravelcardPurchased, ObjectId> {

    fun findAllByUserIdOrderByIat(userId: String) : Flux<TravelcardPurchased>

    @Query("{'ownerId' : { \$eq: ?0}, 'typeId' : { \$eq: ?1 }, 'exp' : { \$gt: ?2 }}")
    fun findByOwnerIdAndTypeId(ownerId: String, typeId: ObjectId, end: Timestamp) : Mono<TravelcardPurchased?>

    fun deleteAllByUserId(ownerId: String)

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findByIatBetween(start: Timestamp, end: Timestamp): Flow<TravelcardPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1 },'userId' : { \$eq: ?2}}")
    fun findByUserAndIatBetween(start:Timestamp, end: Timestamp, userId : String): Flow<TravelcardPurchased>

    @Query("{'exp' : { \$lt: ?0 },'userId' : { \$eq: ?1}}")
    fun findByUserAndExp(end: Timestamp, userId : String): Flow<TravelcardPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1 }, 'userId' : { \$eq: ?2}, 'exp' : { \$lt: ?3}}")
    fun findExpiredByUserAndIatBetween(start:Timestamp, end: Timestamp, userId : String): Flow<TravelcardPurchased>

    @Query("{'exp' : { \$lt : ?0 }}")
    fun findExpired(end: Timestamp): Flow<TravelcardPurchased>

    @Query("{ 'exp' : { \$lt : ?2 }, 'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findExpiredByIatBetween(start: Timestamp, end: Timestamp, now:Timestamp): Flow<TravelcardPurchased>

    @Query("{'exp' : { \$gt : ?0 }}")
    fun findValid(end: Timestamp): Flow<TravelcardPurchased>
    
    @Query("{ 'exp' : { \$gt : ?2 }, 'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findValidByExpBetween(start: Timestamp, end: Timestamp, now: Timestamp): Flow<TravelcardPurchased>

    @Query("{ 'exp' : { \$gt : ?1}, 'userId' : { \$eq: ?0}}")
    fun findAllValidByUserDetails( userId: String, now: Timestamp): Flow<TravelcardPurchased>

    @Query("{ 'iat' : { \$gte: ?0, \$lte: ?1 },'userId' : { \$eq: ?2}, 'exp' : { \$gt : ?3}}")
    fun findAllValidByUserDetailsAndIatBetween( start:Timestamp, end: Timestamp, userId : String): Flow<TravelcardPurchased>

    @Query("{ 'exp' : { \$lt : ?1}, 'userId' : { \$eq: ?0}}")
    fun findAllExpiredByUserDetails( userId: String, now: Timestamp): Flow<TravelcardPurchased>

    @Query("{ 'iat' : { \$gte: ?0, \$lte: ?1 },'userId' : { \$eq: ?2}, 'exp' : { \$lt : ?3}}")
    fun findAllExpiredByUserDetailsAndIatBetween( start:Timestamp, end: Timestamp, userId : String): Flow<TravelcardPurchased>


}