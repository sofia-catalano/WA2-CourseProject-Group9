package it.polito.wa2.wa2lab4group09.travelerservice.entities

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.sql.Timestamp

@Document(collection = "travelcardPurchased")
data class TravelcardPurchased(
    @Id
    @Indexed
    var sub : ObjectId = ObjectId.get(),
    var iat: Timestamp, //creation time
    var exp: Timestamp, //expiration time
    // TODO calcolare exp durante la creazione dell'abbonamento in base al type
    var zid: String,
    var jws: String,
    var typeId : Long,
    var userId: String,
    var ownerId: String //travelcard holder
)
