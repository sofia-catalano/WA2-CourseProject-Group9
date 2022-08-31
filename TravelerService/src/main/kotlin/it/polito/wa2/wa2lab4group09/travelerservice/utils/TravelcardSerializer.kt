package it.polito.wa2.wa2lab4group09.travelerservice.utils

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TravelcardPurchasedDTO
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.slf4j.LoggerFactory

class TravelcardSerializer : Serializer<TravelcardPurchasedDTO> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun serialize(topic: String?, data: TravelcardPurchasedDTO?): ByteArray? {
        log.info("Serializing...")
        return objectMapper.writeValueAsBytes(
            data ?: throw SerializationException("Error when serializing Transaction to ByteArray[]")
        )
    }

    override fun close() {}
}
