package it.polito.wa2.wa2lab3group09.loginservice.services

import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import kotlinx.coroutines.reactor.mono
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class UserDetailsService (private val userRepository: UserRepository) : ReactiveUserDetailsService {

    @Throws(UsernameNotFoundException::class)
    override fun findByUsername(username: String?): Mono<UserDetails> = mono {
        val user = username?.let { userRepository.getByUsername(it) } ?: throw UsernameNotFoundException("The username $username doesn't exist")
        val authorities = ArrayList<GrantedAuthority>()
        authorities.add(SimpleGrantedAuthority(user.role.toString()))
        return@mono User(
            user.username,
            user.password,
            authorities
        )
    }

}

