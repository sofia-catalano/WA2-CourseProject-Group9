package it.polito.wa2.wa2lab3group09.dtos

import it.polito.wa2.wa2lab3group09.entities.Activation
import java.time.LocalDateTime
import java.util.*

data class ActivationDTO(
    val id: UUID?,
    val attemptCounter: Int,
    val expirationDate: LocalDateTime,
    val activationCode: Int
)


fun Activation.toDTO() : ActivationDTO{
    return ActivationDTO(id, attemptCounter, expirationDate, activationCode)
}