package it.polito.wa2.wa2lab4group09.qrcodeservice.services

import io.jsonwebtoken.Jwts
import io.nayuki.qrcodegen.QrCode
import it.polito.wa2.wa2lab4group09.qrcodeservice.AppProperties
import it.polito.wa2.wa2lab4group09.qrcodeservice.controllers.QRCodeController.TravelcardToTravelerService
import it.polito.wa2.wa2lab4group09.qrcodeservice.controllers.QRCodeController.ValidationInfo
import it.polito.wa2.wa2lab4group09.qrcodeservice.controllers.QRCodeController.ValidationToTravelerService
import it.polito.wa2.wa2lab4group09.qrcodeservice.entities.QRCode
import it.polito.wa2.wa2lab4group09.qrcodeservice.repositories.QRCodeRepository
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.QRCodeGenerator
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.qrcodeservice.utils.TravelcardPurchasedDTO
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.withContext
import org.bson.types.ObjectId
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import javax.imageio.ImageIO


@Service
class QRCodeService(val qrCodeRepository: QRCodeRepository, val appProperties: AppProperties) {

    private val travelerClient = WebClient.create("http://localhost:8081")

    @Cacheable(cacheNames = ["qr-code-cache"], sync = true)
    suspend fun generateQRCode(jws : String, sub : ObjectId){
        try {
            val qrCode : QrCode = QrCode.encodeText(jws, QrCode.Ecc.MEDIUM)
            val img: BufferedImage = QRCodeGenerator().toImage(qrCode, 8, 5)
            val baos = ByteArrayOutputStream()
            withContext(Dispatchers.IO) {
                ImageIO.write(img, MediaType.IMAGE_PNG.subtype, baos)
            }
            val qrCodeByteArray: ByteArray = baos.toByteArray()
            //save the qrCode just created in DB
            val qrCodeEntity = QRCode(qrCodeImage = qrCodeByteArray, ticketId = sub, token = jws)
            qrCodeRepository.save(qrCodeEntity).subscribe()
        }catch(ex : IOException) {
            throw IllegalArgumentException(ex)
        }
    }

    @Cacheable(cacheNames = ["qr-code-cache"], sync = true)
    suspend fun getQRCodeByteArray(ticketId : ObjectId) : ByteArray{
        return qrCodeRepository.findByTicketId(ticketId).awaitSingle().qrCodeImage
    }

    suspend fun validateTicket(validationInfo: ValidationInfo): Any = coroutineScope {
        val jwt = Jwts.parserBuilder().setSigningKey(appProperties.keyTicket.toByteArray()).build().parseClaimsJws(validationInfo.jwt)
        //if exp then is a travelcards
        if(jwt.body["exp"] !== null) {
            println("travelcard case")
            println(jwt.body["exp"])
            val ticketId = qrCodeRepository.findByToken(validationInfo.jwt).awaitSingle().ticketId
            println("ticketid $ticketId")
            val travelcardToValidate = TravelcardToTravelerService(ticketId.toString(), validationInfo.zid)
            try {
                val travelcardPurchasedDTO = async {
                    travelerClient
                        .post()
                        .uri("/traveler/checkTravelcard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(travelcardToValidate)
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .awaitBody<TravelcardPurchasedDTO>()
                }
                return@coroutineScope travelcardPurchasedDTO.await()
            } catch (t: Throwable) {
                println(t.message)
                throw IllegalArgumentException("Travelcard expired or ticket zone not allowed!")
            }
        }else{
            println("ticket case")
            val ticketId = qrCodeRepository.findByToken(validationInfo.jwt).awaitSingle().ticketId
            println("ticketID is $ticketId")
            val jti = jwt.body["jti"].toString()
            println(jwt.body["iat"])
            val iat = Date(jwt.body["iat"].toString().toLong()*1000)
            println("conversione riuscita $iat")
            val exp = when (jti) {
                "60 min" -> Date.from(Instant.now().plus(1, ChronoUnit.HOURS)) //60 min
                "90 min" -> Date.from(Instant.now().plus(90, ChronoUnit.MINUTES)) //90 min
                "120 min" -> Date.from(Instant.now().plus(90, ChronoUnit.MINUTES)) //120 min
                "1 day" -> Date.from(Instant.now().plus(1, ChronoUnit.DAYS)) //daily
                "2 day" -> Date.from(Instant.now().plus(2, ChronoUnit.DAYS)) //multidaily 2
                "3 day" -> Date.from(Instant.now().plus(3, ChronoUnit.DAYS)) //multidaily 3
                "1 week" -> Date.from(Instant.now().plus(7, ChronoUnit.DAYS)) //weekly
                else -> { // Note the block
                    throw IllegalArgumentException("Ticket type is not supported")
                }
            }
            println("il ticket scade alle $exp")
            val ticketToValidate = ValidationToTravelerService(exp,ticketId.toString(),validationInfo.zid)
            println(ticketToValidate)
            try {
                val ticketPurchasedDTO = async {
                    travelerClient
                        .post()
                        .uri("/traveler/checkTicket")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(ticketToValidate)
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .awaitBody<TicketPurchasedDTO>()
                }
                return@coroutineScope ticketPurchasedDTO.await()
            }catch(t : Throwable){
                throw IllegalArgumentException("Ticket expired or ticket zone not allowed!")
            }
        }


    }

}