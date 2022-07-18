package it.polito.wa2.wa2lab3group09.loginservice.dtos

import it.polito.wa2.wa2lab3group09.loginservice.entities.Activation
import org.bson.types.ObjectId
import java.time.LocalDateTime
import java.util.*

data class ActivationDTO(
    val id: ObjectId?,
    val attemptCounter: Int,
    val expirationDate: LocalDateTime,
    val activationCode: Int
)


fun Activation.toDTO() : ActivationDTO {
    return ActivationDTO(id, attemptCounter, expirationDate, activationCode)
}