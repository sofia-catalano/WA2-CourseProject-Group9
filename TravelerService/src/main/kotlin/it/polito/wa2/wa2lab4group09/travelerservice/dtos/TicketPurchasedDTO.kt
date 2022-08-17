package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import org.bson.types.ObjectId
import java.sql.Timestamp
import java.util.Date
import java.util.UUID

data class TicketPurchasedDTO(
    var sub: ObjectId?,
    var iat: Date,
    var exp: Date,
    var zid: String,
    var jws: String,
    var validated:Date?
)

fun TicketPurchased.toDTO(): TicketPurchasedDTO {
    return TicketPurchasedDTO(sub, iat, exp, zid, jws,validated)
}
