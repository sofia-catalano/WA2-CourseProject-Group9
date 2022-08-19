package it.polito.wa2.wa2lab4group09.qrcodeservice.services

import io.nayuki.qrcodegen.QrCode
import it.polito.wa2.wa2lab4group09.qrcodeservice.entities.QRCode
import it.polito.wa2.wa2lab4group09.qrcodeservice.repositories.QRCodeRepository
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.QRCodeGenerator
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.TicketPurchasedDTO
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.cache.annotation.*
import org.springframework.stereotype.Service
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import org.springframework.http.MediaType
import java.io.IOException
import javax.imageio.ImageIO


@Service
class QRCodeService(val qrCodeRepository: QRCodeRepository) {

    @Cacheable(cacheNames = ["qr-code-cache"], sync = true)
    suspend fun generateQRCode( ticket : TicketPurchasedDTO): ByteArray {
        val token = ticket.jws
//        token.replace("[\n\r\t]", "_")
        try {
            val qrCode : QrCode = QrCode.encodeText(token, QrCode.Ecc.MEDIUM)
            val img: BufferedImage = QRCodeGenerator().toImage(qrCode, 8, 5)
            val baos = ByteArrayOutputStream()
            withContext(Dispatchers.IO) {
                ImageIO.write(img, MediaType.IMAGE_PNG.subtype, baos)
            }
            val qrCodeByteArray: ByteArray = baos.toByteArray()
            //save the qrCode just created in DB
            val qrCodeEntity = QRCode(qrCodeImage = qrCodeByteArray, ticketOrCardId = ticket.sub!!)
            qrCodeRepository.save(qrCodeEntity).subscribe()

            return qrCodeByteArray
        }catch(ex : IOException) {
            throw IllegalArgumentException(ex)
        }
    }

}