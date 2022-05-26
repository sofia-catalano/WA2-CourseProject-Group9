package it.polito.wa2.wa2lab3group09.loginservice

import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.services.UserService
import org.junit.jupiter.api.Assertions
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
    lateinit var userService: UserService

    @Test
    fun createNewUser() {
        val activationID = userService.createUser(
            UserDTO(
                null,
                "mariorossi",
                "mariorossi@gmail.com",
                "passwordmario"
            )
        )
        Assertions.assertNotNull(activationID)
    }

    @Test
    fun invalidActivationCode() {
        val provisionalId = userService.createUser(
            UserDTO(
                null,
                "mariorossi00",
                "mariorossi00@gmail.com",
                "passwordmario00"
            )
        )
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(provisionalId, 0)
        }
        Assertions.assertEquals(exception.message.toString(),"Invalid activation code!")
    }

    @Test
    fun invalidProvisionalId() {
        val provisionalId = userService.createUser(
            UserDTO(
                null,
                "mariorossi01",
                "mariorossi01@gmail.com",
                "passwordmario01"
            )
        )
        val activationCode:Int = activationRepository.getById(provisionalId)?.activationCode!!
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
        Assertions.assertEquals(exception.message.toString(),"Activation date expired! Deleting user registration data...")
    }

    @Test
    fun overcomeAttemptCounter() {
        val provisionalId = userService.createUser(
            UserDTO(
                null,
                "mariorossi00",
                "mariorossi00@gmail.com",
                "passwordmario00"
            )
        )
        for( i in 1..4){
            val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
                userService.verifyActivationCode(provisionalId, 0)
            }
            Assertions.assertEquals(exception.message.toString(),"Invalid activation code!")
        }
        val exception: IllegalArgumentException  = Assertions.assertThrows(IllegalArgumentException::class.java) {
            userService.verifyActivationCode(provisionalId, 0)
        }
        Assertions.assertEquals(exception.message.toString(),"Max number of activation attempt reached! Deleting user registration data...")
    }

}
