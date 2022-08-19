package it.polito.wa2.lab5.g09.APIGateway.security

import it.polito.wa2.lab5.g09.APIGateway.AppProperties
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.util.function.Predicate

@Component
class JwtAuthenticationFilter(
    var appProperties: AppProperties
    ) : GatewayFilter {

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request: ServerHttpRequest = exchange.request
        //list of free routes
        val apiEndpoints = listOf("/login/user")
        val isApiSecured: Predicate<ServerHttpRequest> = Predicate<ServerHttpRequest> { r ->
            apiEndpoints.stream()
                .noneMatch { uri: String? ->
                    r.uri.path.contains(uri.toString())
                }
        }
        if (isApiSecured.test(request)) {
            if (!request.headers.containsKey("Authorization")) {
                //TODO redirect to loginservice
                val response: ServerHttpResponse = exchange.response
                response.statusCode = HttpStatus.UNAUTHORIZED
                return response.setComplete()
            }
            val token: String = request.headers.getOrEmpty("Authorization")[0]
            try {
                val newToken = token.replace("Bearer", "")
                JwtUtils.validateJwtToken(newToken, appProperties.key)
            } catch (e: IllegalArgumentException) {
                val response: ServerHttpResponse = exchange.response
                response.statusCode = HttpStatus.BAD_REQUEST
                return response.setComplete()
            }
           /* val claims: Claims = jwtUtil.getClaims(token)
            exchange.getRequest().mutate().header("id", java.lang.String.valueOf(claims.get("id"))).build()*/
        }
        return chain.filter(exchange)
    }
}