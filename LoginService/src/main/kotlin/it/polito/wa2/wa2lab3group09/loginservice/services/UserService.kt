package it.polito.wa2.wa2lab3group09.loginservice.services
import it.polito.wa2.wa2lab3group09.loginservice.dtos.ActivationDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.dtos.toDTO
import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*


@Service
class UserService(val emailService: EmailService,
                  val userRepository: UserRepository,
                  val activationRepository: ActivationRepository,
                  val passwordEncoded: PasswordEncoder) {

    fun createUser(userDTO: UserDTO): UUID {
        val userEntity = User(userDTO.username, passwordEncoded.encode(userDTO.password), userDTO.email)

        val userElement = userRepository.save(userEntity)
        val activation = activationRepository.save(Activation().apply {
            user = userEntity
        })
        emailService.sendEmail("Activation Code", "Hi thanks for your subscription, to verify this email please use this activation code: ${activation.activationCode} ", userElement.email)
        return activation.id
    }
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

    fun verifyActivationCode(provisionalId: UUID, activationCode: Int): UserDTO {
        if(!activationRepository.existsById(provisionalId)) throw IllegalArgumentException("Provisional ID not found!")

        val activationInfo : ActivationDTO = activationRepository.getById(provisionalId)!!.toDTO()
        val user = activationRepository.getUserByUUID(provisionalId)

        if(activationInfo.activationCode == activationCode) {
            if(activationInfo.expirationDate >= LocalDateTime.now()){
                activationRepository.delete(activationRepository.getByUser(user)!!)
                userRepository.makeActive(user.getId()!!)
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
                    activationRepository.reduceAttempt(provisionalId)
                    throw IllegalArgumentException("Invalid activation code!")
                }
            }
        }
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