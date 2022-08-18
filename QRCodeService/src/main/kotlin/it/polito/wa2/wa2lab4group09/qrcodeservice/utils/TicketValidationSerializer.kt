package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory

class TicketValidationSerializer : Serializer<TicketValidation> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun serialize(topic: String?, data: TicketValidation?): ByteArray? {
        log.info("Serializing...")
        return objectMapper.writeValueAsBytes(
            data ?: throw SerializationException("Error when serializing Transaction to ByteArray[]")
        )
    }

    override fun close() {}
}

data class TicketValidation (
    @JsonProperty("ticketId")
    @JsonSerialize(using = ToStringSerializer::class)
    var ticketId: ObjectId?
)