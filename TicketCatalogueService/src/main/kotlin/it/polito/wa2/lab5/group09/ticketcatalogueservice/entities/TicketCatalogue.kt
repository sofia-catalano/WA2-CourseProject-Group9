package it.polito.wa2.lab5.group09.ticketcatalogueservice.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("ticket_catalogue")
data class TicketCatalogue (
    @Id
    val ticketId: Long? = null,
    var type: String,
    var price: Float,
    var zones : String,
    val maxAge : Int? = null,
    val minAge : Int? = null,
)