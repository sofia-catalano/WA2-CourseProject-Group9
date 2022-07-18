package it.polito.wa2.wa2lab3group09.loginservice

import it.polito.wa2.wa2lab3group09.loginservice.dtos.toDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
class RepositoryTests {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var activationRepository: ActivationRepository

    @BeforeEach
    fun createUser(){
        val userEntity = User("mariorossi", "passwordmario", "mariorossi@gmail.com")
        userRepository.save(userEntity)
    }

    @AfterEach
    fun deleteUser(){
        userRepository.delete(userRepository.getByUsername("mariorossi")!!)
    }

    @Test
    fun getUser(){
        val user=userRepository.getByUsername("mariorossi")
        Assertions.assertEquals(user?.toDTO()?.password ?: "NoPassword", "passwordmario")
        Assertions.assertEquals(user?.toDTO()?.email ?: "NoEmail", "mariorossi@gmail.com")
    }

    @Test
    fun createActivation(){
        val userEntity=userRepository.getByUsername("mariorossi")
        activationRepository.save(Activation().apply {
            user = userEntity
        })
        val activation = activationRepository.getByUser(userEntity!!)!!
        Assertions.assertEquals(activation.toDTO().attemptCounter, 5)
        Assertions.assertEquals(activation.attemptCounter, 5)
        Assertions.assertEquals(activation.user, userEntity)
    }

    @Test
    fun updateActivation(){
        val user=userRepository.getByUsername("mariorossi")
        val activation= user?.let { activationRepository.getByUser(it) }
        if (activation != null) {
            val attempt=activationRepository.reduceAttempt(activation.id)
            Assertions.assertEquals(attempt, 4)
        }
    }
    @Test
    fun updateIsActive(){
        userRepository.makeActive(userRepository.getByUsername("mariorossi")!!.getId()!!)
        Assertions.assertEquals(userRepository.getByUsername("mariorossi")!!.isActive, true)
    }

}