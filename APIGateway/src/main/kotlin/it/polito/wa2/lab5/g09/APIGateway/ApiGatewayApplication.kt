package it.polito.wa2.lab5.g09.APIGateway

import it.polito.wa2.lab5.g09.APIGateway.security.JwtAuthenticationFilter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec
import org.springframework.cloud.gateway.route.builder.PredicateSpec
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class GatewayConfig {
    @Autowired
    private val filter: JwtAuthenticationFilter? = null
    @Bean
    fun routes(builder: RouteLocatorBuilder): RouteLocator {
        return builder.routes()
            .route(
            "loginService"
        ) { r: PredicateSpec ->
            r.path("/login/**").filters { f: GatewayFilterSpec ->
                f.filter(
                    filter
                )
            }.uri("http://localhost:8080/")
        }.build()
    }
}


@SpringBootApplication
class ApiGatewayApplication

fun main(args: Array<String>) {
    runApplication<ApiGatewayApplication>(*args)
}
