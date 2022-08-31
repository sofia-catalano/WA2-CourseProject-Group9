package it.polito.wa2.lab5.group09.ticketcatalogueservice.dtos

import it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers.TravelcardOwnerDTO
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.TicketCatalogue
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import org.bson.types.ObjectId

data class TicketCatalogueDTO(
    val ticketId: String,
    val type: String,
    val price: Double,
    val zones : String,
    val maxAge : Int? = null,
    val minAge : Int? = null,
    )

fun TicketCatalogue.toDTO(): TicketCatalogueDTO {
    return TicketCatalogueDTO(ticketId.toString(), type, price, zones, maxAge, minAge)
}