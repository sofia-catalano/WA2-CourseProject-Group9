package it.polito.wa2.lab5.g09.paymentservice.controllers

import it.polito.wa2.lab5.g09.paymentservice.dtos.toDTO
import it.polito.wa2.lab5.g09.paymentservice.security.JwtUtils
import it.polito.wa2.lab5.g09.paymentservice.services.PaymentService
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class PaymentController(val paymentService: PaymentService) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String


    @GetMapping("/payment/admin/transactions")
    suspend fun getAllUsersTransactions(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any> {
        return try {
            val orders = paymentService.getAllUsersTransactions().map {
                    t-> t.toDTO()
            }

            ResponseEntity(orders, HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }

    }

    @GetMapping("/payment/transactions")
    suspend fun getAllTransactions(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any> {
        val newToken = jwt.replace("Bearer", "")
        return try {
            val orders = paymentService.getUserTransactions(JwtUtils.getDetailsFromJwtToken(newToken, key).username).map {
                    t-> t.toDTO()
            }

            ResponseEntity(orders, HttpStatus.OK)
        }catch (t: Throwable) {
            ResponseEntity(t.message, HttpStatus.BAD_REQUEST)
        }
    }

}
