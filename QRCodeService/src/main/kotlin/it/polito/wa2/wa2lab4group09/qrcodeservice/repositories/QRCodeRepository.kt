package it.polito.wa2.wa2lab4group09.qrcodeservice.repositories

import it.polito.wa2.wa2lab4group09.qrcodeservice.entities.QRCode
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface QRCodeRepository: ReactiveMongoRepository<QRCode, ObjectId> {

    fun findByTicketId(ticketId : ObjectId) : Mono<QRCode>
    fun findByToken(token : String) : Mono<QRCode>

}