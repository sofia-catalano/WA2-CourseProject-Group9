package it.polito.wa2.lab5.g09.paymentservice.entities
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.sql.Timestamp
import java.util.*

@Table("user_transaction")
data class Transaction (
    @Id
    val transactionId: UUID? = null,
    val amount: Float,
    val customerUsername: String,
    val orderId: UUID,
    val date: Timestamp = Timestamp(System.currentTimeMillis()),
    val isConfirmed: Boolean?
)