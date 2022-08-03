package it.polito.wa2.wa2lab3group09.loginservice.security


import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.collect
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.runBlocking
import org.springframework.core.ResolvableType
import org.springframework.http.MediaType
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

import org.springframework.http.codec.json.AbstractJackson2Decoder
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.server.authentication.AuthenticationWebFilter

class JWTAuthenticationFilter(
    private val authManager: ReactiveAuthenticationManager,
    private val jacksonDecoder:AbstractJackson2Decoder,
    private val jwtHeader: String, private val jwtHeaderStart: String,
    private val key: String
) : AuthenticationWebFilter(authManager) {

}
class AuthReq {
    var username: String? = null
    var password: String? = null
}


