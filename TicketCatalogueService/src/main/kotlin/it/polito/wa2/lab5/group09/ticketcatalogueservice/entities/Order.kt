package it.polito.wa2.lab5.group09.ticketcatalogueservice.entities

import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.util.UUID

@Table("orders")
data class Order(
    @Id
    val orderId: UUID? = null,
    val status: Status = Status.PENDING,
    val ticketCatalogueId: Long,
    val quantity: Int,
    val customerUsername: String,
)

enum class Status {
    PENDING, CANCELED, ACCEPTED
}
