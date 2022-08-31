package it.polito.wa2.wa2lab4group09.travelerservice.repositories

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.entities.UserDetails
import kotlinx.coroutines.flow.Flow
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.Query

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.sql.Timestamp
import java.time.Instant
import java.time.LocalDateTime
import java.util.*

@Repository
interface TicketPurchasedRepository: ReactiveMongoRepository<TicketPurchased, ObjectId> {

    fun deleteAllByUserId(userId : String)

    fun findAllByUserIdOrderByIat(userId: String) : Flux<TicketPurchased>

    @Query("{'validated' : { \$ne : null}}")
    fun findByValidated(): Flow<TicketPurchased>

    @Query("{'validated' : { \$eq : null}}")
    fun findByValid(): Flow<TicketPurchased>

    @Query("{'exp' : { \$lte : ?0}}")
    fun findByExpired(now:Timestamp): Flow<TicketPurchased>

    @Query("{'exp' : {\$lt : ?2, \$gt:?0, \$lt:?1}}")
    fun findByExpiredAndExpiredBetween(start:Timestamp, end: Timestamp,now:Timestamp): Flow<TicketPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findByIatBetween(start:Timestamp, end: Timestamp): Flow<TicketPurchased>

    @Query("{'validated' : {\$eq : null}, 'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findByValidAndIatBetween(start:Timestamp, end: Timestamp): Flow<TicketPurchased>

    @Query("{'validated' : {\$ne : null, \$gte: ?0, \$lte: ?1}}")
    fun findByValidateAndPeriodOfTime(start:Timestamp, end: Timestamp): Flow<TicketPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1 },'userId' : { \$eq: ?2}}")
    fun findByUserDetailsAndIatBetween(start:Timestamp, end: Timestamp, userId : String): Flow<TicketPurchased>

    @Query("{'validated' : { \$ne : null},'userId' : { \$eq: ?0}}")
    fun findAllValidatedByUserDetails( userId: String): Flow<TicketPurchased>

    @Query("{'validated' : { \$ne : null, \$gte: ?0,\$lte: ?1},'userId' : { \$eq: ?2}}")
    fun findValidatedByUserDetailsAndPeriodOfTime(start:Timestamp, end: Timestamp, userId : String): Flow<TicketPurchased>

    @Query("{'validated' : { \$eq : null},'userId' : { \$eq: ?0}}")
    fun findAllValidByUserDetails( userId: String): Flow<TicketPurchased>

    @Query("{'validated' : { \$eq : null},'iat' : { \$gte: ?0, \$lte: ?1 },'userId' : { \$eq: ?2}}")
    fun findAllValidByUserDetailsAndIatBetween( start:Timestamp, end: Timestamp, userId : String): Flow<TicketPurchased>

    @Query("{'exp' : { \$lte : ?1}, 'userId' : { \$eq: ?0}}")
    fun findAllExpiredByUserDetails(username: String, now: Timestamp?): Flow<TicketPurchased>
    //{ “$gte” : { “$date” : 1566345601049 }

    @Query("{'exp' : { \$lt : ?3, \$gt:?1, \$lt:?2 },'userId' : { \$eq: ?0}}")
    fun findAllExpiredByUserDetailsAndExpiredBetween(username: String, start:Timestamp, end: Timestamp, now: Timestamp?): Flow<TicketPurchased>
}

