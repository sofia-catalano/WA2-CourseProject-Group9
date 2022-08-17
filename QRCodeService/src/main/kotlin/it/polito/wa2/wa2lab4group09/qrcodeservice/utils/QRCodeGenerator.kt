package it.polito.wa2.wa2lab4group09.qrcodeservice.utils

import io.nayuki.qrcodegen.QrCode
import java.awt.Color
import java.awt.image.BufferedImage
import java.util.*


class QRCodeGenerator {

    fun toImage(qr : QrCode,scale : Int, border : Int) : BufferedImage {
        return toImage(qr,scale,border, 0xFFFFFF, 0x000000)
    }

    private fun toImage(qr: QrCode, scale: Int, border: Int, lightColor: Int, darkColor: Int): BufferedImage {
        Objects.requireNonNull(qr)
        require(!(scale <= 0 || border < 0)) { "Value out of range" }
        require(!(border > Int.MAX_VALUE / 2 || qr.size + border * 2L > Int.MAX_VALUE / scale)) { "Scale or border too large" }
        val side = (qr.size + border * 2) * scale + 8
        val result = BufferedImage(side, side, BufferedImage.TYPE_BYTE_BINARY)
        val ig2 = result.createGraphics()
        ig2.background = Color.WHITE
        ig2.clearRect(0, 0, side, side)
        for (y in 0 until result.height - 4) {
            for (x in 0 until result.width - 4) {
                val color = qr.getModule(x / scale - border, y / scale - border)
                result.setRGB(x + 4, y + 4, if (color) darkColor else lightColor)
            }
        }
        return result
    }
}