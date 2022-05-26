package it.polito.wa2.lab5.g09.paymentservice.utils
import it.polito.wa2.lab5.g09.paymentservice.services.PaymentService
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.client.awaitBody

@Component
class KafkaConsumer(val paymentService: PaymentService){
    private val logger = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["\${spring.kafka.consumer.topics}"], groupId = "\${spring.kafka.consumer.group-id}")
    fun listenGroupFoo(consumerRecord: ConsumerRecord<Any, Any>, ack: Acknowledgment) {
        logger.info("Message received {}", consumerRecord)
        println((consumerRecord.headers().filter{it.key().equals("Authorization")})[0])
        val header = consumerRecord.headers().filter{it.key().equals("Authorization")}[0]
        val token = String(header.value(), StandardCharsets.UTF_8).replace("Bearer", "")
        runBlocking {
            paymentService.processTransaction(consumerRecord.value() as TransactionInfo, token)
        }
            ack.acknowledge()
    }
}
