package it.polito.wa2.wa2lab3group09.loginservice


import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import java.util.*

@SpringBootApplication
class Wa2Lab3Group09Application



@Bean
fun javaMailSender(): JavaMailSender {
    val mailSender = JavaMailSenderImpl()
    @Value("spring.mail.host")
    mailSender.host = "spring.mail.host"
    @Value("spring.mail.port")
    mailSender.port = "spring.mail.port".toInt()
    @Value("spring.mail.username")
    mailSender.username = "spring.mail.username"
    @Value("spring.mail.password")
    mailSender.password = "spring.mail.password"

    configureJavaMailProperties(mailSender.javaMailProperties)
    return mailSender
}

private fun configureJavaMailProperties(properties: Properties) {
    @Value("spring.mail.transport.protocol")
    properties["mail.transport.protocol"] = "spring.mail.transport.protocol"
    @Value("spring.mail.smtp.auth")
    properties["mail.smtp.auth"] = "spring.mail.smtp.auth"
    @Value("spring.mail.smtp.starttls.enable")
    properties["mail.smtp.starttls.enable"] = "spring.mail..smtp.starttls.enable"
    @Value("spring.mail.debug")
    properties["mail.debug"] = "spring.mail.debug"
}

@SpringBootApplication
class LoginServiceApplication

fun main(args: Array<String>) {
    runApplication<LoginServiceApplication>(*args)
}
