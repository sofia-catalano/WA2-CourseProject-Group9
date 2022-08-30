package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.apache.kafka.common.errors.SerializationException
import org.slf4j.LoggerFactory
import org.apache.kafka.common.serialization.Deserializer
import org.bson.types.ObjectId
import java.util.*
import kotlin.text.Charsets.UTF_8

class TicketDeserializer : Deserializer<TicketPurchasedDTO> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): TicketPurchasedDTO? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            String(
                data ?: throw SerializationException("Error when deserializing byte[] to Payment Result"), UTF_8
            ), TicketPurchasedDTO::class.java
        )
    }

    override fun close() {}
}

data class TicketPurchasedDTO(
    @JsonProperty("sub")
    @JsonSerialize(using = ToStringSerializer::class)
    var sub: ObjectId?,
    @JsonProperty("iat")
    var iat: Date,
    @JsonProperty("exp")
    var exp: Date?,
    @JsonProperty("zid")
    var zid: String,
    @JsonProperty("jws")
    var jws: String,
    @JsonProperty("validated")
    var validated: Date?,
    @JsonProperty("userId")
    var userId: String,
    @JsonProperty("duration")
    var duration: String
)