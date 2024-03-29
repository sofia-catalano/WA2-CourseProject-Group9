package it.polito.wa2.lab5.g09.paymentservice.entities
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.sql.Timestamp

@Document(collection = "user_transaction")
data class Transaction(
    @Id
    @Indexed
    val transactionId: ObjectId = ObjectId.get(),
    val amount: Double,
    val customerUsername: String,
    val orderId: ObjectId,
    val date: Timestamp = Timestamp(System.currentTimeMillis()),
    val isConfirmed: Boolean?
)