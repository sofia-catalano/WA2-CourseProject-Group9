package it.polito.wa2.wa2lab4group09.qrcodeservice.controllers

import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.TicketPurchasedDTO
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class QRCodeController(val qrCodeService: QRCodeService) {

    @GetMapping("/generateQRCode", produces = [MediaType.IMAGE_PNG_VALUE])
    suspend fun createQRCode(ticket: TicketPurchasedDTO) : ResponseEntity<Any>{
        val qrCode = qrCodeService.generateQRCode(ticket)
        val resource = ByteArrayResource(qrCode)
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(resource.contentLength())
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment()
                    .filename("ticket_${ticket.iat.time}")
                    .build().toString())
            .body(resource)
    }



}