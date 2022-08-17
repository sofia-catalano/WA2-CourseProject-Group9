package it.polito.wa2.wa2lab4group09.travelerservice

import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoClients
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration
import org.springframework.data.mongodb.core.convert.MongoCustomConversions
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories
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

@SpringBootApplication(exclude = [DataSourceAutoConfiguration::class])
@EnableReactiveMongoRepositories
class TravelerServiceApplication

fun main(args: Array<String>) {
    runApplication<TravelerServiceApplication>(*args)
}
