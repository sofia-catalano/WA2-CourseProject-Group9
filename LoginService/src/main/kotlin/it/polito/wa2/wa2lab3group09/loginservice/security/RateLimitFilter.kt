package it.polito.wa2.wa2lab3group09.loginservice

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Bucket4j
import io.github.bucket4j.Refill
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import java.time.Duration
/*
@Component
class RateLimitInterceptor: HandlerInterceptor {

    val tokenBucket: Bucket = Bucket4j.builder()
        .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(1))))
        .build()

    @Throws(Exception::class)
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {

        val probe = tokenBucket.tryConsumeAndReturnRemaining(1)
        return if (probe.isConsumed) {
            response.addHeader("X-Rate-Limit-Remaining", probe.remainingTokens.toString())
            true
        } else {
            val waitForRefill = probe.nanosToWaitForRefill / 1000000000
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", waitForRefill.toString())
            response.sendError(
                HttpStatus.TOO_MANY_REQUESTS.value(),
                "You have exhausted your API Request Quota"
            )
            false
        }
    }
}*/
@Component
class RateLimitFilter: WebFilter {

    val tokenBucket: Bucket = Bucket4j.builder()
        .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(1))))
        .build()

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        println("RATE LIMIT FILTER ")
        val probe = tokenBucket.tryConsumeAndReturnRemaining(1)
         if (probe.isConsumed) {
            exchange.getResponse().getHeaders().set("X-Rate-Limit-Remaining", probe.remainingTokens.toString())
        } else {
            val waitForRefill = probe.nanosToWaitForRefill / 1000000000
            exchange.getResponse().getHeaders().set("X-Rate-Limit-Retry-After-Seconds", waitForRefill.toString())
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS)
        }
        return chain.filter(exchange)
    }
}

