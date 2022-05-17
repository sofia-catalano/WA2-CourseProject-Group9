package it.polito.wa2.wa2lab3group09

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Bucket4j
import io.github.bucket4j.Refill
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import java.time.Duration
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

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
}