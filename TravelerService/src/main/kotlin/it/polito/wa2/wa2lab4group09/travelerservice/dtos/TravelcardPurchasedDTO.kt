package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import org.bson.types.ObjectId
import java.sql.Timestamp

data class TravelcardPurchasedDTO(
    var sub: ObjectId?,
    var iat: Timestamp,
    var exp: Timestamp,
    var zid: String,
    var jws: String
)

fun TravelcardPurchased.toDTO(): TravelcardPurchasedDTO {
    return TravelcardPurchasedDTO(sub, iat, exp, zid, jws)
}
