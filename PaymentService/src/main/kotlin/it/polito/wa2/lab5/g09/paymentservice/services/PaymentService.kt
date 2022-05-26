package it.polito.wa2.lab5.g09.paymentservice.services

import it.polito.wa2.lab5.g09.paymentservice.entities.Transaction
import it.polito.wa2.lab5.g09.paymentservice.repositories.TransactionRepository
import it.polito.wa2.lab5.g09.paymentservice.security.JwtUtils
import it.polito.wa2.lab5.g09.paymentservice.utils.PaymentResult
import it.polito.wa2.lab5.g09.paymentservice.utils.TransactionInfo
import kotlinx.coroutines.flow.Flow
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.Message
import org.springframework.messaging.support.MessageBuilder
import org.springframework.stereotype.Service
import kotlin.random.Random

@Service
class PaymentService(val transactionRepository: TransactionRepository,
                     @Value("\${spring.kafka.producer.topics}") val topic: String,
                     @Autowired
                     private val kafkaTemplate: KafkaTemplate<String, Any>
) {
    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String
    private val log = LoggerFactory.getLogger(javaClass)

    suspend fun getAllUsersTransactions() : Flow<Transaction>{
        return try {
            transactionRepository.findAll()
        }catch (t : Throwable){
            throw IllegalArgumentException("Something went wrong")
        }
    }

    suspend fun getUserTransactions(userId: String): Flow<Transaction> {
        return try {
            transactionRepository.findByCustomerUsername(userId)
        }catch (t : Throwable){
            throw IllegalArgumentException("Username not found")
        }
    }

    suspend fun processTransaction(transactionInfo: TransactionInfo, token:String) {
        val newToken = token.replace("Bearer","")
        val isConfirmed = Random.nextBoolean()
        val transaction = Transaction(
            amount = transactionInfo.amount,
            customerUsername = JwtUtils.getDetailsFromJwtToken(newToken, key).username,
            orderId = transactionInfo.orderId,
            isConfirmed = isConfirmed
        )
        val paymentResult = PaymentResult(transactionInfo.orderId, isConfirmed)
        try {
           transactionRepository.save(transaction)
            log.info("Receiving product request")
            log.info("Sending message to Kafka {}", paymentResult)
            val message: Message<PaymentResult> = MessageBuilder
                .withPayload(paymentResult)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("Authorization",token)
                .build()
            kafkaTemplate.send(message)
            log.info("Message sent with success")

        }catch (t : Throwable){
            throw IllegalArgumentException(t.toString())
        }
    }

}
