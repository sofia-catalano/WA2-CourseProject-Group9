package it.polito.wa2.wa2lab4group09.qrcodeservice.controllers

import it.polito.wa2.wa2lab4group09.qrcodeservice.security.JwtUtils
import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.*
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import java.util.*

@Controller
class QRCodeController(val qrCodeService: QRCodeService) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    @GetMapping("/QRCode/generateQRCode/{ticketId}", produces = [MediaType.IMAGE_PNG_VALUE])
    suspend fun downloadQRCode(@RequestHeader("Authorization") jwt:String, @PathVariable ticketId: ObjectId) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        val username = JwtUtils.getDetailsFromJwtToken(newToken, key).username
        val qrCode = qrCodeService.getQRCodeByteArray(ticketId)
        val resource = ByteArrayResource(qrCode)
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(resource.contentLength())
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment()
                    .filename("ticket_of_$username.png")
                    .build().toString())
            .body(resource)
    }

    @PostMapping("/QRCode/validateQRCode")
    suspend fun validateQRCode(@RequestBody validationInfo: ValidationInfo) : ResponseEntity<Any>{
        return try {
            val body : Any = qrCodeService.validateTicket(validationInfo)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage("Ticket expired or ticket zone not allowed!")
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }


    data class ValidationInfo(val jwt : String, val zid : String)
    data class ValidationToTravelerService(val expiration : Date, val ticketId: String, val zid: String)
    data class TravelcardToTravelerService(val ticketId: String, val zid: String)
    data class ErrorMessage(val error: String?)
}