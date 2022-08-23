package it.polito.wa2.wa2lab4group09.travelerservice.dtos

import it.polito.wa2.wa2lab4group09.travelerservice.entities.TravelcardOwner

data class TravelcardOwnerDTO(
    var fiscal_code: String,
    var name: String,
    var surname: String,
    var address: String,
    var date_of_birth: String,
    var telephone_number: String? = null,
)

fun TravelcardOwner.toDTO(): TravelcardOwnerDTO {
    return TravelcardOwnerDTO(fiscal_code, name, surname, address, date_of_birth, telephone_number)
}
