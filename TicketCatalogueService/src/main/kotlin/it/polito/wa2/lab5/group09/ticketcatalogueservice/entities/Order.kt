package it.polito.wa2.lab5.group09.ticketcatalogueservice.entities

import it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers.TravelcardOwnerDTO
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document



@Document(collection = "orders")
data class Order(
    @Id
    @Indexed
    val orderId: ObjectId = ObjectId.get(),
    var status: Status = Status.PENDING,
    val ticketCatalogueId: ObjectId,
    val quantity: Int,
    val customerUsername: String,
    val travelcardOwner: TravelcardOwnerDTO? = null
)

enum class Status {
    PENDING, CANCELED, ACCEPTED
}
