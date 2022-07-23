package it.polito.wa2.wa2lab3group09.loginservice.controllers


import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.services.UserService
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyAndAwait
import java.util.*
import javax.validation.Valid


@RestController
class UserController(val userService: UserService) {
    @PostMapping("/user/register")
    suspend fun registerUser(
        @RequestBody
        @Valid
        userDTO: UserDTO,
        br: BindingResult
    ): ResponseEntity<Any> {

        if (br.hasErrors()) {
            val body = ErrorMessage("Username or password are invalid!")
            return ResponseEntity(body, HttpStatus.BAD_REQUEST)
        }

        return try {
            val uuid: ObjectId? = userService.createUser(userDTO)
            val body = RegistrationResponseBody(uuid!!, userDTO.email)
            ResponseEntity(body, HttpStatus.ACCEPTED)
        } catch (t: Throwable) {
            val body = ErrorMessage("Username or email already used!")
            ResponseEntity(body, HttpStatus.BAD_REQUEST)
        }
    }



    @PostMapping("/user/validate")
    suspend fun validateUser(@RequestBody verificationInfo: VerificationInfo): ResponseEntity<Any> {

        return try {
            val userInfo: UserDTO? =
                userService.verifyActivationCode(verificationInfo.provisionalId, verificationInfo.activationCode)
            val body = userInfo?.let { VerificationResponseBody(it.id!!, userInfo.username, userInfo.email) }
            ResponseEntity(body, HttpStatus.CREATED)
        } catch (t : Throwable) {
            val body = ErrorMessage(t.message)
            ResponseEntity(body, HttpStatus.NOT_FOUND)
        }
    }


}

data class VerificationInfo(val provisionalId: ObjectId, val activationCode: Int)
//to return a json object when data are correctly validated
data class VerificationResponseBody(val userId: ObjectId, val username: String, val email: String)
//to return a json object when registering a new user
data class RegistrationResponseBody(val provisionalId: ObjectId, val email: String)
//to return a JSON-shaped error
data class ErrorMessage(val error: String?)
