package it.polito.wa2.wa2lab3group09.loginservice.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import it.polito.wa2.wa2lab3group09.loginservice.AppProperties
import kotlinx.coroutines.reactor.mono
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.server.WebFilterExchange
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Component
class JWTServerAuthenticationSuccessHandler(var appProperties: AppProperties) : ServerAuthenticationSuccessHandler {
    override fun onAuthenticationSuccess(webFilterExchange: WebFilterExchange?, authentication: Authentication?): Mono<Void> = mono {
        SecurityContextHolder.getContext().authentication = authentication
        val authClaims: MutableList<String> = mutableListOf()
        if (authentication != null) {
            authentication.authorities?.let { authorities ->
                authorities.forEach { claim -> authClaims.add(claim.toString()) }
            }
            val token= generateJwtToken(authentication.principal as UserDetails)
            webFilterExchange?.exchange?.response?.headers?.set(appProperties.jwtHeader, appProperties.jwtHeaderStart + token)
        }

        return@mono null
    }
    private fun generateJwtToken(authentication: UserDetails): String {
        val username = authentication.username
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
            .claim("role", authentication.authorities.first().toString())
            .signWith(Keys.hmacShaKeyFor(appProperties.key.toByteArray())).compact()
    }
}
