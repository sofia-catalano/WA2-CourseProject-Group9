package it.polito.wa2.lab5.group09.ticketcatalogueservice.controllers

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Order
import it.polito.wa2.lab5.group09.ticketcatalogueservice.entities.Status
import it.polito.wa2.lab5.group09.ticketcatalogueservice.repositories.OrderRepository
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.JwtUtils
import it.polito.wa2.lab5.group09.ticketcatalogueservice.security.Role
import it.polito.wa2.lab5.group09.ticketcatalogueservice.services.TicketCatalogueService
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactor.awaitSingle
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.Message
import org.springframework.messaging.support.MessageBuilder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeFormatter

@RestController
class TicketCatalogueController(
    val ticketCatalogueService: TicketCatalogueService,
    val orderRepository: OrderRepository,
    @Value("\${spring.kafka.producer.topics}") val topic: String,
    @Autowired
    private val kafkaTemplate: KafkaTemplate<String, Any>
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val travelerClient = WebClient.create("http://localhost:8081")

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String


    @GetMapping("/catalogue/orders")
    suspend fun getOrders(@RequestHeader("Authorization") jwt: String): ResponseEntity<Any> {
        val newToken = jwt.replace("Bearer", "")
        return try {
            val orders: Flow<Order> = ticketCatalogueService.getOrders(newToken)
            ResponseEntity(orders, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/catalogue/orders/{orderId}")
    suspend fun getOrdersByUUID(
        @PathVariable orderId: ObjectId,
        @RequestHeader("Authorization") jwt: String
    ): ResponseEntity<Any> {
        val newToken = jwt.replace("Bearer", "")
        return try {
            val orders: Order = ticketCatalogueService.getOrderByUUID(orderId, newToken)
            ResponseEntity(orders, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/catalogue/tickets")
    suspend fun getTickets(): ResponseEntity<Any> {
        return try {
            val ticketCatalogue = ticketCatalogueService.getCatalogue()
            ResponseEntity(ticketCatalogue, HttpStatus.OK)
        } catch (t: Throwable) {
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }

    }

    @PostMapping("/catalogue/shop/{ticketType}")
    suspend fun buyTickets(
        @PathVariable ticketType: String,
        @RequestHeader("Authorization") jwt: String,
        @RequestBody purchasingInfo: PurchasingInfo
    ): ResponseEntity<Any> = coroutineScope {

        try{
            val newToken = jwt.replace("Bearer", "")
            var isValid = true
            val ticketCatalogue = ticketCatalogueService.getTicket(purchasingInfo.ticketId)
            val username = JwtUtils.getDetailsFromJwtToken(newToken, key).username

            if(purchasingInfo.numberOfTickets<=0){
                throw IllegalArgumentException("Ticket quantity should be a positive number")
            }
            if(purchasingInfo.paymentInfo.creditCardNumber.length <= 15){
                throw IllegalArgumentException("Credit card number length should be greater than 14 digit!")
            }
            if(!purchasingInfo.paymentInfo.cvv.matches("[0-9][0-9][0-9]".toRegex())){
                throw IllegalArgumentException("Cvv should be a 3 digit number!")
            }

            if(!purchasingInfo.paymentInfo.expirationDate.matches("(0[1-9]|10|11|12)/2[0-9]".toRegex())){
                throw IllegalArgumentException("Invalid expiration date format!")
            }


            if (ticketCatalogue.maxAge != null || ticketCatalogue.minAge != null) {

                val traveler = async {
                    travelerClient
                        .get()
                        .uri("/my/profile")
                        .header("Authorization", jwt)
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .awaitBody<UserDetailDTO>()
                }


                if(traveler.await().date_of_birth.isNullOrBlank()){
                    throw IllegalArgumentException("You have to set your age in my/profile first because this kind of ticket has age restriction!")
                }


                val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                val age = Period.between(LocalDate.parse(traveler.await().date_of_birth, formatter), LocalDate.now()).years

                isValid =
                    (ticketCatalogue.maxAge != null && age <= ticketCatalogue.maxAge) && (ticketCatalogue.minAge != null && ticketCatalogue.minAge <= age)
            }

            if (isValid) {
                val order = orderRepository.save(
                    Order(
                        status = Status.PENDING,
                        ticketCatalogueId = purchasingInfo.ticketId,
                        quantity = purchasingInfo.numberOfTickets,
                        customerUsername = username,
                    )
                ).awaitSingle()

                val transaction=TransactionInfo(order.orderId,ticketCatalogue.price*purchasingInfo.numberOfTickets, purchasingInfo.paymentInfo.creditCardNumber, purchasingInfo.paymentInfo.expirationDate, purchasingInfo.paymentInfo.cvv, purchasingInfo.paymentInfo.cardHolder)
                log.info("Receiving product request")
                log.info("Sending message to Kafka {}", order)
                val message: Message<TransactionInfo> = MessageBuilder
                    .withPayload(transaction)
                    .setHeader(KafkaHeaders.TOPIC, topic)
                    .setHeader("Authorization", jwt)
                    .build()
                kafkaTemplate.send(message)
                log.info("Message sent with success")
                ResponseEntity( order.orderId, HttpStatus.OK)
            } else {
                throw IllegalArgumentException("Your age is out of range!")
            }
        }catch(t: Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }

    }


}

data class ErrorMessage(val error: String?)

data class PaymentInfo(
    @JsonProperty("creditCardNumber")
    val creditCardNumber: String,
    @JsonProperty("expirationDate")
    val expirationDate: String,
    @JsonProperty("cvv")
    val cvv: String,
    @JsonProperty("cardHolder")
    val cardHolder: String
)

data class PurchasingInfo(val numberOfTickets: Int, val ticketId: ObjectId, val paymentInfo: PaymentInfo)

data class TransactionInfo(
    @JsonProperty("orderId")
    @JsonSerialize(using = ToStringSerializer::class)
    val orderId: ObjectId,
    @JsonProperty("amount")
    val amount: Double,
    @JsonProperty("creditCardNumber")
    val creditCardNumber: String,
    @JsonProperty("expirationDate")
    val expirationDate: String,
    @JsonProperty("cvv")
    val cvv: String,
    @JsonProperty("cardHolder")
    val cardHolder: String
)

data class UserDetailDTO(
    val username: String,
    val name: String?,
    val surname: String?,
    val address: String?,
    val date_of_birth: String?,
    val telephone_number: String?,
    val role: Role
)


