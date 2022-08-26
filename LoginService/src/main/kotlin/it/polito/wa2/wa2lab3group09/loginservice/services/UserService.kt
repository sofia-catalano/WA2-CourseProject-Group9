package it.polito.wa2.wa2lab3group09.loginservice.services
import it.polito.wa2.wa2lab3group09.loginservice.dtos.ActivationDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.toDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitSingle
import org.bson.types.ObjectId
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime


@Service
class UserService(val emailService: EmailService,
                  val userRepository: UserRepository,
                  val activationRepository: ActivationRepository,
                  val passwordEncoded: PasswordEncoder) {

    suspend fun createUser(userDTO: UserDTO): String? {
        val userEntity = User(
            username = userDTO.username,
            password = passwordEncoded.encode(userDTO.password),
            email = userDTO.email
        )
        val usr = userRepository.save(userEntity).awaitFirst()
        val activation = Activation().apply {
            user = usr
        }
        activationRepository.save(activation).awaitFirst().apply {
            sendEmail(this)
            return this.id.toString()
        }

    }

    suspend fun verifyActivationCode(provisionalId: ObjectId, activationCode: Int): UserDTO? {
        if(!(activationRepository.existsById(provisionalId).awaitFirst())) throw IllegalArgumentException("Provisional ID not found!")

        lateinit var activationInfo: ActivationDTO

        val activation : Activation? = activationRepository.getById(provisionalId).awaitSingle()?.apply {
            activationInfo = this.toDTO()
        }

        val user = activationRepository.getById(provisionalId).awaitSingle()?.user


        user?.let{
            if(activationInfo.activationCode == activationCode) {
                if(activationInfo.expirationDate >= LocalDateTime.now()){
                    if (activation != null) {
                        activationRepository.delete(activation).subscribe()
                    }

                    userRepository.save(it.copy(isActive = true )).awaitSingle().apply {
                        println(this)
                    }


                    return user.toDTO()
                }else{
                    userRepository.delete(user).subscribe()
                    throw IllegalArgumentException("Activation date expired! Deleting user registration data... Please register again!")
                }

            } else {
                when (activationInfo.attemptCounter) {
                    1 ->{
                        userRepository.delete(user).subscribe()
                        activationRepository.delete(activation!!).subscribe()

                        throw IllegalArgumentException("Max number of activation attempt reached! Deleting user registration data... Please register again!")
                    }
                    else -> {
                        if (activation != null) {
                            activationRepository.save(activation.copy(attemptCounter = activation.attemptCounter - 1)).awaitFirst()
                        }
                        throw IllegalArgumentException("Invalid activation code!")
                    }
                }
            }
        }
        return null
    }

    fun sendEmail(activation: Activation){
        emailService.sendEmail("Activation Code", "Hi thanks for your subscription, to verify this email please use this activation code: ${activation.activationCode} ", activation.user!!.email)
    }

    @Scheduled(fixedRate = 30000)
    @Async
    //scheduled function that every 30 seconds prunes expired registration data
    fun deleteExpiredDate(){
        //fetch all the IDs of user with expiring data
        val idList = activationRepository.getExpiredUserIDs()
        //TODO VEDERE SE FUNZIONAA
        idList.flatMap{ value ->
            userRepository.deleteById(value)
        }
    }

}