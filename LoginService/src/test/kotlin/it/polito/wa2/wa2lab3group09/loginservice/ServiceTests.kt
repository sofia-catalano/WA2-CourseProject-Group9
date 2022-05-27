package it.polito.wa2.wa2lab3group09.loginservice

import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import it.polito.wa2.wa2lab3group09.loginservice.services.UserService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDateTime
import java.util.*

@SpringBootTest
class ServiceTests {

    @Autowired
    lateinit var activationRepository: ActivationRepository
    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var userService: UserService

    lateinit var activationID : UUID


    @BeforeEach
    fun createNewUser() {
        activationID = userService.createUser(
            UserDTO(
                null,
                "mariorossi",
                "mariorossi@gmail.com",
                "passwordmario"
            )
        )
    }

    @Test
    fun invalidActivationCode() {
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(activationID, 0)
        }
        Assertions.assertEquals(exception.message.toString(),"Invalid activation code!")
    }

    @Test
    fun invalidProvisionalId() {
        val activationCode:Int = activationRepository.getById(activationID)?.activationCode!!
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(UUID.randomUUID(), activationCode)
        }
        Assertions.assertEquals(exception.message.toString(),"Provisional ID not found!")
    }

    @Test
    fun expiredActivationDate() {
        val provisionalId = userService.createUser(
            UserDTO(
                null,
                "mariorossi03",
                "mariorossi03@gmail.com",
                "passwordmario03"
            ),
            LocalDateTime.now()
        )
        val activationCode:Int = activationRepository.getById(provisionalId)?.activationCode!!
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(provisionalId, activationCode)
        }
        userRepository.findAll().last().also { userRepository.delete(it) }
        Assertions.assertEquals(exception.message.toString(),"Activation date expired! Deleting user registration data...")
    }

    @Test
    fun overcomeAttemptCounter() {

        for( i in 1..4){
            val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
                userService.verifyActivationCode(activationID, 0)
            }
            Assertions.assertEquals(exception.message.toString(),"Invalid activation code!")
        }
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(activationID, 0)
        }
        Assertions.assertEquals(exception.message.toString(),"Max number of activation attempt reached! Deleting user registration data...")
    }

    @AfterEach
    fun deleteAll(){
        if(userRepository.findAll().count() !== 0){
            userRepository.findAll().last().also { userRepository.delete(it) }
        }
    }

}
