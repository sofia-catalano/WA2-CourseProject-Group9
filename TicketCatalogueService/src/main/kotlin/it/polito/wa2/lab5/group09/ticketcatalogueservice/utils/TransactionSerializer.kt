package it.polito.wa2.lab5.group09.ticketcatalogueservice.utils
import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers.TransactionInfo
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.slf4j.LoggerFactory


class TransactionSerializer : Serializer<TransactionInfo> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun serialize(topic: String?, data: TransactionInfo?): ByteArray? {
        log.info("Serializing...")
        return objectMapper.writeValueAsBytes(
            data ?: throw SerializationException("Error when serializing Transaction to ByteArray[]")
        )
    }

    override fun close() {}
}
