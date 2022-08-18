package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardOwner

data class TravelcardOwnerDTO(
    var fiscalCode: String,
    var name: String? = null,
    var surname: String? = null,
    var address: String?= null,
    var date_of_birth: String? = null,
    var telephone_number: String? = null,
)

fun TravelcardOwner.toDTO(): TravelcardOwnerDTO {
    return TravelcardOwnerDTO(fiscalCode, name, surname, address, date_of_birth, telephone_number)
}
