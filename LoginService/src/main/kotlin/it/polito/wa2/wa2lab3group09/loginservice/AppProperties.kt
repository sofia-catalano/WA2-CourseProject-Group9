package it.polito.wa2.wa2lab3group09

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class AppProperties {

    @Value("\${application.jwt.jwtHeader}")
    lateinit var jwtHeader: String

    @Value("\${application.jwt.jwtHeaderStart}")
    lateinit var jwtHeaderStart: String

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String
}