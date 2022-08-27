package it.polito.wa2.wa2lab4group09.travelerservice

import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoClients
import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.bson.types.ObjectId
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
import org.springframework.kafka.core.KafkaAdmin
import java.nio.ByteBuffer
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
        converterList.add(MongoLongToObjectIDConverter())
        return MongoCustomConversions(converterList)
    }
    private class MongoDateToTimestampConverter : Converter<Date, Timestamp> {
        override fun convert(source: Date): Timestamp {
            return Timestamp(source.time)
        }
    }
    private class MongoLongToObjectIDConverter : Converter<Long, ObjectId> {
        override fun convert(source: Long): ObjectId {
            val b = ByteArray(12)
            val bb2 = ByteBuffer.wrap(b)
            bb2.putLong(source)
            bb2.putInt(32)
            return ObjectId(b)
        }
    }

    fun longToObjectId(l: Long, inc: Int): ObjectId? {
        val b = ByteArray(12)
        val bb2 = ByteBuffer.wrap(b)
        bb2.putLong(l)
        bb2.putInt(inc)
        return ObjectId(b)
    }
}

@Configuration
class KafkaProducerConfig(
    @Value("\${spring.kafka.producer.bootstrap-servers}")
    private val servers: String,
    @Value("\${spring.kafka.producer.topic1}")
    private val topic1: String,
    @Value("\${spring.kafka.producer.topic2}")
    private val topic2: String,
) {

    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        val configs: MutableMap<String, Any?> = HashMap()
        configs[AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG] = servers
        return KafkaAdmin(configs)
    }

    @Bean
    fun porduto(): NewTopic {
        return NewTopic(topic1, 1, 1.toShort())
    }

    @Bean
    fun generateTravelcardQRCode() : NewTopic{
        return NewTopic(topic2,1,1.toShort())
    }

}

@SpringBootApplication(exclude = [DataSourceAutoConfiguration::class])
@EnableReactiveMongoRepositories
class TravelerServiceApplication

fun main(args: Array<String>) {
    runApplication<TravelerServiceApplication>(*args)
}
