package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import org.bson.types.ObjectId
import java.util.Date

data class TicketPurchasedDTO(
    @JsonProperty("sub")
    @JsonSerialize(using = ToStringSerializer::class)
    var sub: ObjectId?,
    @JsonProperty("iat")
    var iat: Date,
    @JsonProperty("exp")
    var exp: Date,
    @JsonProperty("zid")
    var zid: String,
    @JsonProperty("jws")
    var jws: String,
    @JsonProperty("validated")
    var validated: Date?,
    @JsonProperty("userID")
    var userId: String
)

fun TicketPurchased.toDTO(): TicketPurchasedDTO {
    return TicketPurchasedDTO(sub, iat, exp, zid, jws,validated, userId)
}
