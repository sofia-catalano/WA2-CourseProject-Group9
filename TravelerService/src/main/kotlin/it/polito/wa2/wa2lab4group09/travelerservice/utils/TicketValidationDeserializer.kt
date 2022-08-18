package it.polito.wa2.wa2lab4group09.travelerservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.apache.kafka.common.errors.SerializationException
import org.slf4j.LoggerFactory
import org.apache.kafka.common.serialization.Deserializer
import org.bson.types.ObjectId
import kotlin.text.Charsets.UTF_8

class TicketValidationDeserializer : Deserializer<ValidationRequest> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): ValidationRequest? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            String(
                data ?: throw SerializationException("Error when deserializing byte[] to Payment Result"), UTF_8
            ), ValidationRequest::class.java
        )
    }

    override fun close() {}
}

data class ValidationRequest(
    @JsonProperty("ticketId")
    @JsonSerialize(using = ToStringSerializer::class)
    val ticketId: ObjectId,
)