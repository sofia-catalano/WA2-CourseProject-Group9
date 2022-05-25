package it.polito.wa2.lab5.group09.ticketcatalogueservice

import io.r2dbc.spi.ConnectionFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator
import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.kafka.core.KafkaAdmin

@Configuration
@EnableR2dbcRepositories
class DbConfig {


    @Bean
    fun initializer(connectionFactory: ConnectionFactory): ConnectionFactoryInitializer {
        val initializer = ConnectionFactoryInitializer()
        initializer.setConnectionFactory(connectionFactory)
        initializer.setDatabasePopulator(
            ResourceDatabasePopulator(
                ClassPathResource("tables.sql")
            )
        )
        return initializer
    }


}

@Configuration
class KafkaConfig(
    @Value("\${spring.kafka.producer.bootstrap-servers}")
    private val servers: String,
    @Value("\${spring.kafka.producer.topics.product}")
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

@SpringBootApplication
class TicketCatalogueServiceApplication

fun main(args: Array<String>) {
    runApplication<TicketCatalogueServiceApplication>(*args)
}


