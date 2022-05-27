package it.polito.wa2.lab5.group09.ticketcatalogueservice.utils

import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import kotlinx.coroutines.runBlocking

@Component
class KafkaConsumer(val ticketCatalogueService: TicketCatalogueService){
    private val logger = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["\${spring.kafka.consumer.topics}"], groupId = "\${spring.kafka.consumer.group-id}")
    fun listenGroupFoo(consumerRecord: ConsumerRecord<Any, Any>, ack: Acknowledgment) {
        logger.info("Message received {}", consumerRecord)
        val header = consumerRecord.headers().filter{it.key().equals("Authorization")}[0]
        val token = String(header.value(), StandardCharsets.UTF_8)
        runBlocking {
            ticketCatalogueService.updateOrder(consumerRecord.value() as PaymentResult, token)
        }
        ack.acknowledge()
    }
}
