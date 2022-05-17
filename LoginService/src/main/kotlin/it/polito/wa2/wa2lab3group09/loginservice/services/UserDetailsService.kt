package it.polito.wa2.wa2lab3group09.services

import it.polito.wa2.wa2lab3group09.repositories.UserRepository
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

@Component
class UserDetailsService (private val userRepository: UserRepository) : UserDetailsService {

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(s: String): UserDetails {
        val user = userRepository.getByUsername(s) ?: throw UsernameNotFoundException("The username $s doesn't exist")
        val authorities = ArrayList<GrantedAuthority>()
        authorities.add(SimpleGrantedAuthority(user.role.toString()))
        return User(
            user.username,
            user.password,
            authorities
        )
    }
}