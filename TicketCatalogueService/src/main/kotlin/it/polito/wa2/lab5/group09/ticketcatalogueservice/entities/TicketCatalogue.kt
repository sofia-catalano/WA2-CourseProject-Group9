package it.polito.wa2.lab5.group09.ticketcatalogueservice.entities

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document


@Document(collection = "ticket_catalogue")
data class TicketCatalogue (
    @Id
    @Indexed
    val ticketId: ObjectId = ObjectId.get(),
    var type: String,
    var price: Double,
    var zones : String,
    val maxAge : Int? = null,
    val minAge : Int? = null,
)