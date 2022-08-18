package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import kotlinx.coroutines.runBlocking

@Component
class KafkaConsumer(val qrCodeService: QRCodeService){
    private val logger = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["\${spring.kafka.consumer.topics}"], groupId = "\${spring.kafka.consumer.group-id}")
    fun listenGroupFoo(consumerRecord: ConsumerRecord<Any, Any>, ack: Acknowledgment) {
        logger.info("Message received {}", consumerRecord)
        val header = consumerRecord.headers().filter{it.key().equals("Authorization")}[0]
        val token = String(header.value(), StandardCharsets.UTF_8)
        runBlocking {
            //userDetailsService.updateTicket(consumerRecord.value() as PaymentResult, token)
            //TODO: create ticket after QRCode creation request
            //qrCodeService.createQRCode(...)
        }
        ack.acknowledge()
    }
}
