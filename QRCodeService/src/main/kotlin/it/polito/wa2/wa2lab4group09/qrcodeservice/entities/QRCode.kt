package it.polito.wa2.wa2lab4group09.qrcodeservice.entities

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "QRCodes")
data class QRCode(
    @Id
    @Indexed
    val qrCodeId : ObjectId = ObjectId.get(),
    val qrCodeImage : ByteArray? = null,
    val usernameCustomer : String

) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as QRCode

        if (qrCodeId != other.qrCodeId) return false
        if (!qrCodeImage.contentEquals(other.qrCodeImage)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = qrCodeId.hashCode()
        result = 31 * result + qrCodeImage.contentHashCode()
        return result
    }
}