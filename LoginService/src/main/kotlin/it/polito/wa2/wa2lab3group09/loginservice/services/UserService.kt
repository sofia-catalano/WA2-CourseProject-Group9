package it.polito.wa2.wa2lab3group09.loginservice.services
import it.polito.wa2.wa2lab3group09.loginservice.dtos.ActivationDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.toDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.bson.types.ObjectId
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.kotlin.extra.bool.not
import java.time.LocalDateTime
import java.util.*


@Service
class UserService(val emailService: EmailService,
                  val userRepository: UserRepository,
                  val activationRepository: ActivationRepository,
                  val passwordEncoded: PasswordEncoder) {

    suspend fun createUser(userDTO: UserDTO): ObjectId {
        val userEntity = User(userDTO.username, passwordEncoded.encode(userDTO.password), userDTO.email)

        val userElement = userRepository.save(userEntity).awaitFirstOrNull()
        activationRepository.save(Activation().apply {
            user = userEntity
            userElement?.let{
                emailService.sendEmail("Activation Code", "Hi thanks for your subscription, to verify this email please use this activation code: ${this.activationCode} ", userElement.email)
            }
            return this.id
        })
    }
    /*
    fun createUser(userDTO: UserDTO, e_date : LocalDateTime): UUID {
        val userEntity = User(userDTO.username, passwordEncoded.encode(userDTO.password), userDTO.email)

        val userElement = userRepository.save(userEntity)
        val activation = activationRepository.save(
            Activation()
            .apply {
                user = userEntity
                expirationDate = e_date
            })
        emailService.sendEmail("Activation Code", "Hi thanks for your subscription, to verify this email please use this activation code: ${activation.activationCode} ", userElement.email)
        return activation.id
    }
     */

    suspend fun verifyActivationCode(provisionalId: ObjectId, activationCode: Int): UserDTO? {
        if(!(activationRepository.existsById(provisionalId).awaitFirst())) throw IllegalArgumentException("Provisional ID not found!")

        val activation : Activation = activationRepository.getById(provisionalId)!!
        val activationInfo: ActivationDTO = activation.toDTO()
        val user = activationRepository.getById(provisionalId)?.user

        user?.let{
            if(activationInfo.activationCode == activationCode) {
                if(activationInfo.expirationDate >= LocalDateTime.now()){
                    activationRepository.delete(activationRepository.getByUser(user)!!)

                    userRepository.save(it.copy(isActive = true ))


                    return user.toDTO()
                }else{
                    userRepository.delete(user)
                    throw IllegalArgumentException("Activation date expired! Deleting user registration data...")
                }

            } else {
                when (activationInfo.attemptCounter) {
                    1 ->{
                        userRepository.delete(user)
                        throw IllegalArgumentException("Max number of activation attempt reached! Deleting user registration data...")
                    }
                    else -> {
                        activationRepository.save(activation.copy(attemptCounter = activation.attemptCounter - 1))
                        throw IllegalArgumentException("Invalid activation code!")
                    }
                }
            }
        }
        return null
    }

    @Scheduled(fixedRate = 30000)
    @Async
    //scheduled function that every 30 seconds prunes expired registration data
    fun deleteExpiredDate(){
        //fetch all the IDs of user with expiring data
        val idList = activationRepository.getExpiredUserIDs()

        idList.forEach {
            userRepository.deleteById(it)
        }
    }

}