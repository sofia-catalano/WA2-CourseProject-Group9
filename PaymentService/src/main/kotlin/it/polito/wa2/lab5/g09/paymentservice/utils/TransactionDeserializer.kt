package it.polito.wa2.lab5.g09.paymentservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.slf4j.LoggerFactory
import java.util.*
import org.apache.kafka.common.serialization.Deserializer
import kotlin.text.Charsets.UTF_8

class TransactionDeserializer : Deserializer<TransactionInfo> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): TransactionInfo? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            String(
                data ?: throw SerializationException("Error when deserializing byte[] to Product"), UTF_8
            ), TransactionInfo::class.java
        )
    }

    override fun close() {}
}


data class TransactionInfo(
    @JsonProperty("orderId")
    val orderId: UUID,
    @JsonProperty("amount")
    val amount: Float,
    @JsonProperty("paymentInfo")
    val paymentInfo: PaymentInfo
)
data class PaymentInfo(
    val creditCardNumber: String,
    val expirationDate: String,
    val cvv: String,
    val cardHolder: String
)