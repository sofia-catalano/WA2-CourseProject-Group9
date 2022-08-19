package it.polito.wa2.wa2lab4group09.travelerservice.entities

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "travelcardOwner")
data class TravelcardOwner(
    @Id
    @Indexed
    var fiscalCode: String,
    var name: String? = null,
    var surname: String? = null,
    var address: String? = null,
    var date_of_birth: String? = null,
    var telephone_number: String? = null,
)