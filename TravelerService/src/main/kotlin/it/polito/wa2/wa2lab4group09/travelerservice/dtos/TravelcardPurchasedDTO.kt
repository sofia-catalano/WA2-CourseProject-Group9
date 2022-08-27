package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardPurchased
import org.bson.types.ObjectId
import java.sql.Timestamp
import java.util.*

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
)

fun TravelcardPurchased.toDTO(): TravelcardPurchasedDTO {
    return TravelcardPurchasedDTO(sub, iat, exp, zid, jws, userId)
}
