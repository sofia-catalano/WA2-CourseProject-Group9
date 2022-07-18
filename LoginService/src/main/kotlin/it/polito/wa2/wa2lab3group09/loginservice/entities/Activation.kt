package it.polito.wa2.wa2lab3group09.loginservice.entities

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime
import java.util.*
import kotlin.math.floor

@Document
data class Activation(
    val attemptCounter: Int = 5,
    val expirationDate : LocalDateTime = LocalDateTime.now().plusHours(1),
    val activationCode : Int = floor(100000 + Math.random() * 900000).toInt(), //6 digits activation code
    @Id
    val id: ObjectId = ObjectId.get()
) {

 //   @OneToOne
    var user: User? = null
}