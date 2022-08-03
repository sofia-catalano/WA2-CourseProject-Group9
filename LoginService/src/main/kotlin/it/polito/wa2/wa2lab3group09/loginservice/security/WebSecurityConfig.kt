package it.polito.wa2.wa2lab3group09.loginservice.security

import io.netty.handler.codec.http.HttpMethod
import it.polito.wa2.wa2lab3group09.loginservice.AppProperties
import it.polito.wa2.wa2lab3group09.loginservice.RateLimitFilter
import it.polito.wa2.wa2lab3group09.loginservice.services.UserDetailsService
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.buffer.DataBufferUtils.matcher
import org.springframework.http.codec.json.AbstractJackson2Decoder
import org.springframework.http.codec.json.Jackson2JsonDecoder
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import javax.validation.Validator

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebFluxSecurity
class WebSecurityConfig(val userDetailsService: UserDetailsService) {
    @Autowired
    lateinit var appProperties: AppProperties

    @Bean
    fun passwordEncoded(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun reactiveAuthenticationManager(reactiveUserDetailsService: UserDetailsService,
                                      passwordEncoder: PasswordEncoder): ReactiveAuthenticationManager {
        val manager = UserDetailsRepositoryReactiveAuthenticationManager(reactiveUserDetailsService)
        manager.setPasswordEncoder(passwordEncoder)
        return manager
    }

    @Bean
    fun jacksonDecoder(): AbstractJackson2Decoder = Jackson2JsonDecoder()


    @Bean
    fun configureSecurity(http: ServerHttpSecurity) : SecurityWebFilterChain? {
        val authenticationFilter = JWTAuthenticationFilter(reactiveAuthenticationManager(userDetailsService, passwordEncoded()),jacksonDecoder(),  appProperties.jwtHeader,appProperties.jwtHeaderStart,appProperties.key)
        val jwtConverter=JWTConverter(jacksonDecoder())
        authenticationFilter.setServerAuthenticationConverter(jwtConverter)
        authenticationFilter.setAuthenticationSuccessHandler(JWTServerAuthenticationSuccessHandler(appProperties))
        authenticationFilter.setRequiresAuthenticationMatcher { ServerWebExchangeMatchers.pathMatchers("/user/login").matches(it) }
        val authorizationFilter = JWTAuthorizationFilter(appProperties.key)

        return http
            .cors()
            .and()
            .csrf().disable()
            .authorizeExchange()
            .pathMatchers("/user/**")
            .permitAll()
            .and()
            .authorizeExchange()
            .pathMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
            .and()
            .addFilterAt(RateLimitFilter(), SecurityWebFiltersOrder.FIRST)
            .addFilterAt(authenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .addFilterAt(authorizationFilter, SecurityWebFiltersOrder.AUTHORIZATION)
            .build()
    }

}
