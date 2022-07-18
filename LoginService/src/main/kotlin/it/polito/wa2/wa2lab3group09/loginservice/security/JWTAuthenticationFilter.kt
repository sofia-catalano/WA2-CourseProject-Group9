package it.polito.wa2.wa2lab3group09.loginservice.security


import com.fasterxml.jackson.databind.ObjectMapper
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import reactor.core.publisher.Mono
import java.io.BufferedReader
import java.io.IOException
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import kotlin.collections.ArrayList


class JWTAuthenticationFilter(
    private val authManager: ReactiveAuthenticationManager, private val jwtHeader: String, private val jwtHeaderStart: String, private val key: String
    ) : UsernamePasswordAuthenticationFilter() {

    @Throws(AuthenticationException::class)
    override fun attemptAuthentication(
        req: HttpServletRequest,
        res: HttpServletResponse?
    ): Authentication {

        return try {
            val reader: BufferedReader = req.reader
            val sb = StringBuffer()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                sb.append(line)
            }
            val parsedReq = sb.toString()
            val mapper = ObjectMapper()
            val authReq: AuthReq = mapper.readValue(parsedReq, AuthReq::class.java)
            authManager.authenticate(UsernamePasswordAuthenticationToken(
                authReq.username,
                authReq.password,
                ArrayList()
            )).block()!!
        } catch (e: IOException) {
            throw AuthenticationServiceException(e.message)
        }
    }


    @Throws(IOException::class, ServletException::class)
    override fun successfulAuthentication(
        req: HttpServletRequest,
        res: HttpServletResponse,
        chain: FilterChain?,
        auth: Authentication
    ) {
        SecurityContextHolder.getContext().authentication = auth
        val authClaims: MutableList<String> = mutableListOf()
        auth.authorities?.let { authorities ->
            authorities.forEach { claim -> authClaims.add(claim.toString()) }
        }
        val token= generateJwtToken(auth.principal as UserDetails)
        res.addHeader(jwtHeader, jwtHeaderStart + token)
    }

    private fun generateJwtToken(authentication: UserDetails): String {
        val username = authentication.username
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date.from(Instant.now()))
            .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
            .claim("role", authentication.authorities.first().toString())
            .signWith(Keys.hmacShaKeyFor(key.toByteArray())).compact()
    }
}

class AuthReq {
    var username: String? = null
    var password: String? = null
}