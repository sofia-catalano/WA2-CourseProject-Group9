package it.polito.wa2.wa2lab4group09.qrcodeservice.controllers

import it.polito.wa2.wa2lab4group09.qrcodeservice.security.JwtUtils
import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader

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

    //TODO: validate qrCode



}