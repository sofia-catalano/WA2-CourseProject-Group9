package it.polito.wa2.wa2lab4group09.travelerservice.security

import it.polito.wa2.wa2lab4group09.travelerservice.AppProperties
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebFluxSecurity
class WebSecurityConfig{

    @Autowired
    lateinit var appProperties: AppProperties

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity) : SecurityWebFilterChain?{
        val authorizationFilter = JWTAuthorizationFilter(appProperties.key)
        return http
            .cors()
            .and()
            .csrf().disable()
            .authorizeExchange()
            .pathMatchers("/traveler/checkTicket").permitAll()
            .and()
            .addFilterAt(authorizationFilter, SecurityWebFiltersOrder.AUTHORIZATION)
            .authorizeExchange()
            .pathMatchers("/traveler/my/profile").hasAnyAuthority("ROLE_CUSTOMER","ROLE_ADMIN")
            .pathMatchers("/traveler/my/tickets").hasAuthority("ROLE_CUSTOMER")
            .pathMatchers("/traveler/my/travelcards").hasAuthority("ROLE_CUSTOMER")
            .pathMatchers("/traveler/admin/**").hasAuthority("ROLE_ADMIN")
            .and()
            .exceptionHandling()
            .authenticationEntryPoint { swe: ServerWebExchange, _: AuthenticationException ->
                Mono.fromRunnable {
                    swe.response.statusCode = HttpStatus.UNAUTHORIZED
                }
            }
            .accessDeniedHandler { swe: ServerWebExchange, _: AccessDeniedException ->
                Mono.fromRunnable { swe.response.statusCode = HttpStatus.FORBIDDEN }
            }
            .and()
            .build()

    }
}