package it.polito.wa2.wa2lab3group09.loginservice.entities

import org.hibernate.annotations.GenericGenerator
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.OneToOne
import kotlin.math.floor

@Entity
class Activation(
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name="uuid2", strategy="uuid2")
    var id: UUID = UUID.randomUUID(),
    var attemptCounter: Int = 5,
    var expirationDate : LocalDateTime = LocalDateTime.now().plusHours(1),
    var activationCode : Int = floor(100000 + Math.random() * 900000).toInt() //6 digits activation code
) {

    @OneToOne
    var user: User? = null
}