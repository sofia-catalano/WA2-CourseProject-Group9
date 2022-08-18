package it.polito.wa2.wa2lab4group09.travelerservice

import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoClients
import it.polito.wa2.wa2lab4group09.travelerservice.utils.TicketValidationDeserializer
import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration
import org.springframework.data.mongodb.core.convert.MongoCustomConversions
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.core.KafkaAdmin
import org.springframework.kafka.listener.ContainerProperties
import java.sql.Timestamp
import java.util.*

@EnableReactiveMongoRepositories
class MongoReactiveApplication : AbstractReactiveMongoConfiguration() {
    @Bean
    fun mongoClient(): MongoClient {
        return MongoClients.create()
    }

    override fun autoIndexCreation(): Boolean {
        return true
    }

    override fun getDatabaseName(): String {
        return "travelerservice"
    }
}

@Configuration
class SpringMongoConfiguration
{
    @Bean
    fun customConversions(): MongoCustomConversions {
        val converterList: MutableList<Converter<*, *>> = ArrayList()
        converterList.add(MongoDateToTimestampConverter())
        return MongoCustomConversions(converterList)
    }
    private class MongoDateToTimestampConverter : Converter<Date, Timestamp> {
        override fun convert(source: Date): Timestamp {
            return Timestamp(source.time)
        }
    }
}

@Configuration
class KafkaProducerConfig(
    @Value("\${spring.kafka.producer.bootstrap-servers}")
    private val servers: String,
    @Value("\${spring.kafka.producer.topics}")
    private val topic: String
) {

    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        val configs: MutableMap<String, Any?> = HashMap()
        configs[AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG] = servers
        return KafkaAdmin(configs)
    }

    @Bean
    fun porduto(): NewTopic {
        return NewTopic(topic, 1, 1.toShort())
    }
}

@EnableKafka
@Configuration
class KafkaConsumerConfig(
    @Value("\${spring.kafka.consumer.bootstrap-servers}")
    private val servers: String
) {

    @Bean
    fun consumerFactory(): ConsumerFactory<String?, Any?> {
        val props: MutableMap<String, Any> = HashMap()
        props[ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG] = servers
        props[ConsumerConfig.GROUP_ID_CONFIG] = "ppr"
        props[ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG] = StringDeserializer::class.java
        props[ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG] = TicketValidationDeserializer::class.java
        props[ConsumerConfig.AUTO_OFFSET_RESET_CONFIG] = "earliest"
        return DefaultKafkaConsumerFactory(props)
    }

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, Any>? {
        val factory = ConcurrentKafkaListenerContainerFactory<String, Any>()
        factory.consumerFactory = consumerFactory()
        factory.containerProperties.ackMode = ContainerProperties.AckMode.MANUAL_IMMEDIATE
        factory.containerProperties.isSyncCommits = true
        return factory
    }
}

@SpringBootApplication(exclude = [DataSourceAutoConfiguration::class])
@EnableReactiveMongoRepositories
class TravelerServiceApplication

fun main(args: Array<String>) {
    runApplication<TravelerServiceApplication>(*args)
}
