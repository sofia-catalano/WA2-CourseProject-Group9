package it.polito.wa2.lab5.group09.ticketcatalogueservice.dtos

import it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers.TravelcardOwnerDTO
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status

data class OrderDTO(
    val orderId: String,
    var status: Status,
    val ticketCatalogueId: String,
    val duration: String,
    val quantity: Int,
    val customerUsername: String,
    val owner: TravelcardOwnerDTO? = null
)

fun Order.toDTO(): OrderDTO {
    return OrderDTO(orderId.toString(), status, ticketCatalogueId.toString(), duration, quantity, customerUsername, owner)
}