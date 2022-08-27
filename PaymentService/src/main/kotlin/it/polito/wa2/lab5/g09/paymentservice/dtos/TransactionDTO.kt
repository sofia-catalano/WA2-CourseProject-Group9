package it.polito.wa2.lab5.g09.paymentservice.dtos

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import org.bson.types.ObjectId
import java.sql.Timestamp

data class TransactionDTO (

    val transactionId: String,
    val amount: Double,
    val customerUsername: String,
    val orderId: String,
    val date: Timestamp = Timestamp(System.currentTimeMillis()),
    val isConfirmed: Boolean?
)

fun Transaction.toDTO(): TransactionDTO {
    return TransactionDTO(transactionId.toString(), amount, customerUsername, orderId.toString(), date, isConfirmed)
}