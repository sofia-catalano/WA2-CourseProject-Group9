package it.polito.wa2.lab5.g09.paymentservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.apache.kafka.common.errors.SerializationException
import org.slf4j.LoggerFactory
import org.apache.kafka.common.serialization.Deserializer
import org.bson.types.ObjectId
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
    @JsonSerialize(using = ToStringSerializer::class)
    val orderId: ObjectId,
    @JsonProperty("amount")
    val amount: Double,
    @JsonProperty("creditCardNumber")
    val creditCardNumber: String,
    @JsonProperty("expirationDate")
    val expirationDate: String,
    @JsonProperty("cvv")
    val cvv: String,
    @JsonProperty("cardHolder")
    val cardHolder: String
)
