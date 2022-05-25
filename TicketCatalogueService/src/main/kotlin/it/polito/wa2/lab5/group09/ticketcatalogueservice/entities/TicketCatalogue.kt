package it.polito.wa2.lab5.group09.ticketcatalogueservice.entities

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("ticket_catalogue")
data class TicketCatalogue (
    @Id
    val ticketId: Long? = null,
    val type: String,
    val price: Float,
    val maxAge : Int? = null,
    val minAge : Int? = null,
)