package it.polito.wa2.wa2lab4group09.qrcodeservice.controllers

import it.polito.wa2.wa2lab4group09.qrcodeservice.services.QRCodeService
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.InputStreamResource
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.io.OutputStream

@Controller
class QRCodeController(val qrCodeService: QRCodeService) {

    @GetMapping("/prova", produces = [MediaType.IMAGE_PNG_VALUE])
    suspend fun createQRCode() : ResponseEntity<Any>{
        val prova = qrCodeService.generateQRCode("prova", 256, 256)
        val resource = ByteArrayResource(prova)
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(resource.contentLength())
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment()
                    .filename("prova.png")
                    .build().toString())
            .body(resource)

    }

}