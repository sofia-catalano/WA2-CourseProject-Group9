package it.polito.wa2.wa2lab3group09.security

import it.polito.wa2.wa2lab3group09.AppProperties
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class WebSecurityConfig(val userDetailsService: UserDetailsService) : WebSecurityConfigurerAdapter() {

    @Autowired
    lateinit var appProperties: AppProperties

    @Bean
    fun passwordEncoded(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
    override fun configure (auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoded())
    }
    override fun configure(web: WebSecurity) {
        super.configure(web)
    }

    @Bean
    @Throws(Exception::class)
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }


    override fun configure(http: HttpSecurity) {
        val authenticationFilter = JWTAuthenticationFilter(authenticationManager(),appProperties.jwtHeader,appProperties.jwtHeaderStart,appProperties.key)

        authenticationFilter.setFilterProcessesUrl("/user/login")
        http
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
    }

}