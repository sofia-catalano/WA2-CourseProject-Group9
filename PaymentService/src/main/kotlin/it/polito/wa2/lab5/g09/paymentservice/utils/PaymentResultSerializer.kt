package it.polito.wa2.lab5.g09.paymentservice.utils

import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.slf4j.LoggerFactory


class PaymentResultSerializer : Serializer<PaymentResult> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun serialize(topic: String?, data: PaymentResult?): ByteArray? {
        log.info("Serializing...")
        return objectMapper.writeValueAsBytes(
            data ?: throw SerializationException("Error when serializing PaymentResult to ByteArray[]")
        )
    }

    override fun close() {}
}
