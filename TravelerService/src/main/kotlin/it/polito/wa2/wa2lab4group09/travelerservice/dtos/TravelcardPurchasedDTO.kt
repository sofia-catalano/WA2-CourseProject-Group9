package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import org.bson.types.ObjectId
import java.sql.Timestamp

data class TravelcardPurchasedDTO(
    @JsonProperty("sub")
    @JsonSerialize(using = ToStringSerializer::class)
    var sub: ObjectId?,
    @JsonProperty("iat")
    var iat: Timestamp,
    @JsonProperty("exp")
    var exp: Timestamp,
    @JsonProperty("zid")
    var zid: String,
    @JsonProperty("jws")
    var jws: String,
    @JsonProperty("userId")
    var userId: String
    @JsonProperty("duration")
    var duration: String
)

fun TravelcardPurchased.toDTO(): TravelcardPurchasedDTO {
    return TravelcardPurchasedDTO(sub, iat, exp, zid, jws, userId, duration)
}