package it.polito.wa2.wa2lab3group09.loginservice.security

import it.polito.wa2.wa2lab3group09.loginservice.AppProperties
import it.polito.wa2.wa2lab3group09.loginservice.services.UserDetailsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
//import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository

@Configuration
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
    fun configureSecurity(http: HttpSecurity) : DefaultSecurityFilterChain? {
        val authenticationFilter = JWTAuthenticationFilter(reactiveAuthenticationManager(userDetailsService, passwordEncoded()),appProperties.jwtHeader,appProperties.jwtHeaderStart,appProperties.key)

        authenticationFilter.setFilterProcessesUrl("/user/login")
        return http
            .cors()
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no sessions
            .and()
            .addFilter(authenticationFilter)
            .formLogin()
            .loginPage("/user/login")
            .loginProcessingUrl("/user/login")
            .usernameParameter("username")
            .passwordParameter("password")
            .permitAll()
            .and()
            .authorizeRequests()
            .mvcMatchers("/user/**")
            .permitAll()
            .and()
            .logout()
            .permitAll()
            .and()
            .build()
    }

}