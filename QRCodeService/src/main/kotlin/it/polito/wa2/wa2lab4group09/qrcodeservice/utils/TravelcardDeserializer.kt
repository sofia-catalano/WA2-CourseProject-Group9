package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import java.sql.Timestamp

class TravelcardDeserializer : Deserializer<TravelcardPurchasedDTO> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): TravelcardPurchasedDTO? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            String(
                data ?: throw SerializationException("Error when deserializing byte[] to Payment Result"),
                Charsets.UTF_8
            ), TravelcardPurchasedDTO::class.java
        )
    }

    override fun close() {}
}

data class TravelcardPurchasedDTO(
    @JsonProperty("sub")
    @JsonSerialize(using = ToStringSerializer::class)
    var sub: ObjectId?,
    @JsonProperty("iat")
    var iat: Timestamp,
    @JsonProperty("exp")
    var exp: Timestamp,
    @JsonProperty("zid")
    var zid: String,
    @JsonProperty("jws")
    var jws: String,
    @JsonProperty("userId")
    var userId: String
)
