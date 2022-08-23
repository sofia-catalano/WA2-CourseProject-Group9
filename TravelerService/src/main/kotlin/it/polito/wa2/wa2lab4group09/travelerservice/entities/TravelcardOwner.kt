package it.polito.wa2.wa2lab4group09.travelerservice.entities

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "travelcardOwner")
data class TravelcardOwner(
    @Id
    @Indexed
    var fiscal_code: String,
    var name: String,
    var surname: String,
    var address: String,
    var date_of_birth: String,
    var telephone_number: String? = null
)