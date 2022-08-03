package it.polito.wa2.wa2lab3group09.loginservice.security

import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.ResolvableType
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity.badRequest
import org.springframework.http.codec.json.AbstractJackson2Decoder
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException.BadRequest
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import javax.validation.Validator

@Component
class JWTConverter(private val jacksonDecoder: AbstractJackson2Decoder) : ServerAuthenticationConverter {

    override fun convert(exchange: ServerWebExchange?): Mono<Authentication> = mono {
        println("JWT CONVERT")
        val loginRequest = getUsernameAndPassword(exchange!!) ?: throw AuthenticationServiceException("Problem with authentication")
        return@mono UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
    }

    private suspend fun getUsernameAndPassword(exchange: ServerWebExchange): AuthReq? {
        val dataBuffer = exchange.request.body
        val type = ResolvableType.forClass(AuthReq::class.java)
        return jacksonDecoder
            .decodeToMono(dataBuffer, type, MediaType.APPLICATION_JSON, mapOf())
            .onErrorResume { Mono.empty<AuthReq>() }
            .cast(AuthReq::class.java)
            .awaitFirstOrNull()
    }
}
class AuthReq {
    var username: String? = null
    var password: String? = null
}

