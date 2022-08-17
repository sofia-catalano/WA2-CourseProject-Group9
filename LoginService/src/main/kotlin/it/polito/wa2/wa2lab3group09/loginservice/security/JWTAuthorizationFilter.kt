package it.polito.wa2.wa2lab3group09.loginservice.security

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

class JWTAuthorizationFilter(
    private val key: String
) : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        println("Authorization filter")
        return if(exchange.request.headers.getFirst("Authorization").isNullOrBlank()){
            //ReactiveSecurityContextHolder.withAuthentication(null)
            println("Authorization filter1")
            //Mono.empty()
            chain.filter(exchange).subscriberContext(ReactiveSecurityContextHolder.withAuthentication(null))
        }else {
            val token = getAuthentication(exchange.request.headers.getFirst("Authorization")!!)
            //ReactiveSecurityContextHolder.withAuthentication(token)
            println("Authorization filter2")
            //Mono.empty()
            chain.filter(exchange).subscriberContext(ReactiveSecurityContextHolder.withAuthentication(token))
        }
    }

    private fun getAuthentication(token: String): UsernamePasswordAuthenticationToken? {
        return try {
            JwtUtils.validateJwtToken(token.replace("Bearer", ""), key)
            val userDetailsDTO = JwtUtils.getDetailsFromJwtToken(token.replace("Bearer", ""), key)
            val authorities = HashSet<GrantedAuthority>(1)
            authorities.add(SimpleGrantedAuthority("ROLE_"+userDetailsDTO.role.toString()))
            val ctx: SecurityContext = SecurityContextHolder.getContext()
            SecurityContextHolder.setContext(ctx)
            ctx.authentication = UsernamePasswordAuthenticationToken(userDetailsDTO.username, null, authorities)
            ReactiveSecurityContextHolder.withAuthentication(ctx.authentication)
            UsernamePasswordAuthenticationToken(userDetailsDTO.username, null, authorities)


        } catch (e: Exception) {
            return null
        }
    }
}


