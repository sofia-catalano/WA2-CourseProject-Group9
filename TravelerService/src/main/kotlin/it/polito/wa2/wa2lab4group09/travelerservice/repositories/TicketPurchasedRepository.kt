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
import java.util.*


@Repository
interface TicketPurchasedRepository: ReactiveMongoRepository<TicketPurchased, ObjectId> {
    fun findAllByUserDetails(userDetails: UserDetails) : Flow<TicketPurchased>

    fun deleteAllByUserDetails(userDetails: UserDetails)

    @Query("{'validated' : { \$ne : null}}")
    fun findByValidate(): Flow<TicketPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1}}")
    fun findByIatBetween(start:Timestamp, end: Timestamp): Flow<TicketPurchased>

    @Query("{'validated' : {\$ne : null, \$gte: ?0, \$lte: ?1}}")
    fun findByValidateAndPeriodOfTime(start:Timestamp, end: Timestamp): Flow<TicketPurchased>

    @Query("{'iat' : { \$gte: ?0, \$lte: ?1 },'userDetails' : { \$eq: ?2}}")
    fun findByUserDetailsAndIatBetween(start:Timestamp, end: Timestamp, userDetails: UserDetails): Flow<TicketPurchased>

    @Query("{'validated' : { \$ne : null},'userDetails' : { \$eq: ?0}}")
    fun findAllValidatedByUserDetails( userDetails: UserDetails): Flow<TicketPurchased>

    @Query("{'validated' : {\$ne : null, \$gte: ?0, \$lte: ?1},'userDetails' : { \$eq: ?2}}")
    fun findAllValidatedByUserDetailsAndPeriodOfTime(start:Timestamp, end: Timestamp, userDetails: UserDetails): Flow<TicketPurchased>
}
