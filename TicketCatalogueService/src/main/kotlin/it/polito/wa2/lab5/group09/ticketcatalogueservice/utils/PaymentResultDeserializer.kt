package it.polito.wa2.lab5.group09.ticketcatalogueservice.utils


import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.kafka.common.errors.SerializationException
import org.slf4j.LoggerFactory
import org.apache.kafka.common.serialization.Deserializer
import org.bson.types.ObjectId
import kotlin.text.Charsets.UTF_8

class PaymentResultDeserializer : Deserializer<PaymentResult> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): PaymentResult? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            String(
                data ?: throw SerializationException("Error when deserializing byte[] to Payment Result"), UTF_8
            ), PaymentResult::class.java
        )
    }

    override fun close() {}
}

data class PaymentResult(
    @JsonProperty("orderId")
    val orderId: ObjectId,
    @JsonProperty("confirmed")
    val confirmed: Boolean
)