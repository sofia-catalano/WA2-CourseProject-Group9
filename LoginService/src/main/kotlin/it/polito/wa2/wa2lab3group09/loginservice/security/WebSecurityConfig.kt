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
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler
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
    fun authenticationWebFilter(reactiveAuthenticationManager: ReactiveAuthenticationManager,
                                jwtConverter: ServerAuthenticationConverter,
                                serverAuthenticationSuccessHandler: ServerAuthenticationSuccessHandler,
                                serverAuthenticationFailureHandler: ServerAuthenticationFailureHandler): AuthenticationWebFilter {

        val authenticationWebFilter = AuthenticationWebFilter(reactiveAuthenticationManager)
        authenticationWebFilter.setRequiresAuthenticationMatcher { ServerWebExchangeMatchers.pathMatchers("/login/user/login").matches(it) }
        authenticationWebFilter.setServerAuthenticationConverter(jwtConverter)
        authenticationWebFilter.setAuthenticationSuccessHandler(serverAuthenticationSuccessHandler)
        authenticationWebFilter.setAuthenticationFailureHandler(serverAuthenticationFailureHandler)
        return authenticationWebFilter
    }
    @Bean
    fun configureSecurity(http: ServerHttpSecurity,  authenticationWebFilter: AuthenticationWebFilter) : SecurityWebFilterChain? {
        val authorizationFilter = JWTAuthorizationFilter(appProperties.key)

        return http
            .cors()
            .and()
            .csrf().disable()
            .authorizeExchange()
            .pathMatchers("/login/user/**")
            .permitAll()
            .and()
            .authorizeExchange()
            .pathMatchers("/login/admin/**").hasAuthority("ROLE_ADMIN")
            .and()
            .addFilterAt(RateLimitFilter(), SecurityWebFiltersOrder.FIRST)
            .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .addFilterAt(authorizationFilter, SecurityWebFiltersOrder.AUTHORIZATION)
            .build()
    }

}
