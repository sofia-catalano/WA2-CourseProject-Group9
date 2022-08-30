package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import kotlinx.coroutines.runBlocking
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.sql.Timestamp

@Component
class KafkaConsumer(val qrCodeService: QRCodeService){
    private val logger = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["\${spring.kafka.consumer.topic1}"], groupId = "\${spring.kafka.consumer.group-id}", containerFactory = "kafkaListenerContainerFactory")
    fun listenGroupFoo(consumerRecord: ConsumerRecord<Any, Any>, ack: Acknowledgment) {
        logger.info("Message received {}", consumerRecord)
        val header = consumerRecord.headers().filter{it.key().equals("Authorization")}[0]
        val token = String(header.value(), StandardCharsets.UTF_8)
        println(consumerRecord.topic())
            runBlocking {
                val a = consumerRecord.value() as TicketPurchasedDTO
                qrCodeService.generateQRCode(a.jws,a.sub!!)
            }
        ack.acknowledge()
    }
    @KafkaListener(topics = ["\${spring.kafka.consumer.topic2}"], groupId = "\${spring.kafka.consumer.group-id}", containerFactory = "kafkaListenerContainerFactory2")
    fun listenGroupFoo2(consumerRecord: ConsumerRecord<Any, Any>, ack: Acknowledgment) {
        logger.info("Message received {}", consumerRecord)
        val header = consumerRecord.headers().filter{it.key().equals("Authorization")}[0]
        val token = String(header.value(), StandardCharsets.UTF_8)
        println(consumerRecord.topic())
            runBlocking {
                val a = consumerRecord.value() as TravelcardPurchasedDTO
                qrCodeService.generateQRCode(a.jws,a.sub!!)
            }
        ack.acknowledge()
    }
}

