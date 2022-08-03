package it.polito.wa2.wa2lab3group09.loginservice.services

import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Role
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AdminService(val userRepository:UserRepository,val passwordEncoded: PasswordEncoder){
    suspend fun createAdmin(username: String, userDTO: UserDTO):User? {

        val admin= userRepository.getByUsername(username).awaitSingle()
        if (admin != null && admin.enroll) {
            val userEntity = User(
                username = userDTO.username,
                password = passwordEncoded.encode(userDTO.password),
                email = userDTO.email,
                role= Role.ADMIN,
                enroll = false,
            )
            return userRepository.save(userEntity).awaitFirstOrNull()
        }
        else{
            throw Throwable("The current admin has not enroll capability")
        }

    }

    suspend fun enrollAdmin(adminUsername: String, adminUsernameToEnroll: String) {
            if(adminUsername==adminUsernameToEnroll){
                throw Throwable("It is not possible to enroll itself")
            }
            val admin= userRepository.getByUsername(adminUsername).awaitSingle()
            if (admin != null && admin.enroll) {
                var adminToEnroll: User? = userRepository.getByUsername(adminUsernameToEnroll).awaitSingle()
                adminToEnroll?.let{
                    adminToEnroll.enroll=true
                    userRepository.save(adminToEnroll).awaitFirstOrNull()
                }?: throw Throwable("The admin to enroll does not exist")
            }
            else{
                throw Throwable("the current admin has not enroll capability")
            }
    }

}
