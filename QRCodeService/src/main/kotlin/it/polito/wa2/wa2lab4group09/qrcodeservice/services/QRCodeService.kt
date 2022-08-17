package it.polito.wa2.wa2lab4group09.qrcodeservice.services

import io.nayuki.qrcodegen.QrCode
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.QRCodeGenerator
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
class QRCodeService {

    @Cacheable(cacheNames = ["qr-code-cache"], sync = true)
    suspend fun generateQRCode( token : String, width: Int, height : Int): ByteArray {
        token.replace("[\n\r\t]", "_")
        println("Generating QRCODE with token :$token, width: $width, height: $height")
        try {
            val qrCode : QrCode = QrCode.encodeText(token, QrCode.Ecc.MEDIUM)
            val img: BufferedImage = QRCodeGenerator().toImage(qrCode, 8, 5)
            val baos = ByteArrayOutputStream()
            withContext(Dispatchers.IO) {
                ImageIO.write(img, MediaType.IMAGE_PNG.subtype, baos)
            }
            return baos.toByteArray()
        }catch(ex : IOException) {
            throw IllegalArgumentException(ex);
        }
    }

}