package it.polito.wa2.wa2lab3group09.loginservice

import it.polito.wa2.wa2lab3group09.loginservice.controllers.VerificationInfo
import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.repositories.ActivationRepository
import it.polito.wa2.wa2lab3group09.loginservice.repositories.UserRepository
import org.junit.jupiter.api.*
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.postForEntity
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpEntity
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.transaction.annotation.Transactional
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.util.*
import kotlin.concurrent.thread

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestMethodOrder(OrderAnnotation::class)
class IntegrationTests {
    companion object {

        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") { "create-drop" }

        }
    }

    @LocalServerPort
    protected var port: Int = 0

    @Autowired
    lateinit var restTemplate: TestRestTemplate

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var activationRepository: ActivationRepository

    val validUser = UserDTO(1, "test", "test@gmail.com", "C1@oc1@0")


    @Test
    @Order(1)
    fun rejectInvalidUser() {

        val baseUrl = "http://localhost:$port"
        val wrongUsername = UserDTO(1, "", "test@gmail.com", "C1@oc1@0")
        val wrongPassword = UserDTO(1, "test", "test@gmail.com", "test")
        val wrongEmail = UserDTO(1, "test", "", "C1@oc1@0")
        val request1 = HttpEntity(wrongUsername)
        val request2 = HttpEntity(wrongPassword)
        val request3 = HttpEntity(wrongEmail)
        val response1 = restTemplate.postForEntity<String>("$baseUrl/user/register", request1)
        val response2 = restTemplate.postForEntity<String>("$baseUrl/user/register", request2)
        val response3 = restTemplate.postForEntity<String>("$baseUrl/user/register", request3)
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response1.statusCode)
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response2.statusCode)
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response3.statusCode)
    }

    @Test
    @Order(2)
    fun acceptValidUserAndRejectAlreadyRegistered() {
        val baseUrl = "http://localhost:$port"
        val request1 = HttpEntity(validUser)
        val response1 = restTemplate.postForEntity<String>("$baseUrl/user/register", request1)
        Assertions.assertEquals(HttpStatus.ACCEPTED, response1.statusCode)
        val request2 = HttpEntity(validUser)
        val response2 = restTemplate.postForEntity<String>("$baseUrl/user/register", request2)
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response2.statusCode)
    }

    @Test
    @Order(3)
    fun rejectInvalidActivationUUID() {
        val baseUrl = "http://localhost:$port"
        val verificationInfo = VerificationInfo(UUID.randomUUID(), 123456)
        val request = HttpEntity(verificationInfo)
        val response = restTemplate.postForEntity<String>("$baseUrl/user/validate", request)
        Assertions.assertEquals(HttpStatus.NOT_FOUND, response.statusCode)

    }

    @Test
    @Order(4)
    fun acceptActivationInfo() {
        val baseUrl = "http://localhost:$port"
        val user = UserDTO(null, "userTest", "userTest@test.com", "Passw0rdTest!")
        restTemplate.postForEntity<Any>("$baseUrl/user/register", HttpEntity(user))
        val activation = activationRepository.getByUser(userRepository.getByUsername(user.username)!!)
        val activationInfo = VerificationInfo(activation!!.id, activation.activationCode)
        val request = HttpEntity(activationInfo)
        val response = restTemplate.postForEntity<Any>("$baseUrl/user/validate", request)
        Assertions.assertEquals(HttpStatus.CREATED, response.statusCode)
    }

    @Test
    @Order(5)
    fun rejectWhenActivationCodeIsInvalid() {
        val baseUrl = "http://localhost:$port"
        val user = UserDTO(null, "userTest2", "userTest2@test.com", "Passw0rdTest!")
        restTemplate.postForEntity<Any>("$baseUrl/user/register", HttpEntity(user))
        val activation = activationRepository.getByUser(userRepository.getByUsername(user.username)!!)
        val activationInfo = VerificationInfo(activation!!.id, "000000".toInt())
        val request = HttpEntity(activationInfo)
        val response = restTemplate.postForEntity<String>("$baseUrl/user/validate", request)
        Assertions.assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
    }

    @Test
    @Order(6)
    fun removeWhenAttemptCounterIsZero() {
        val baseUrl = "http://localhost:$port"
        val user = UserDTO(null, "userTest3", "userTest3@test.com", "Passw0rdTest!")
        restTemplate.postForEntity<Any>("$baseUrl/user/register", HttpEntity(user))
        val activation = activationRepository.getByUser(userRepository.getByUsername(user.username)!!)
        val activationInfo = VerificationInfo(activation!!.id, "000000".toInt())
        val request = HttpEntity(activationInfo)
        for (i in 1..5) {
            restTemplate.postForEntity<String>("$baseUrl/user/validate", request)
        }
        Assertions.assertEquals(activationRepository.existsById(activation.id), false)
    }

    @Test
    @Order(7)
    fun rejectRequestCreateUserOverAllowedCapacity() {
        val baseUrl = "http://localhost:$port"
        var response: ResponseEntity<String>?
        val user = UserDTO(null, "userTest4", "userTest4@test.com", "Passw0rdTest!")
        for (i in 1..11) {
            thread {
                response = restTemplate.postForEntity("$baseUrl/user/register", HttpEntity(user))
                when (i) {
                    11 -> Assertions.assertEquals(HttpStatus.TOO_MANY_REQUESTS, response!!.statusCode)
                }
            }
        }
    }

    @Test
    @Order(8)
    @Transactional
    fun rejectRequestValidateUserOverAllowedCapacity() {
        val baseUrl = "http://localhost:$port"
        var response: ResponseEntity<String>?
        val activation = activationRepository.getByUser(userRepository.getByUsername("userTest5")!!)
        val activationInfo = VerificationInfo(activation!!.id, "000000".toInt())
        val request = HttpEntity(activationInfo)
        for (i in 1..11) {
            thread {
                response = restTemplate.postForEntity("$baseUrl/user/validate", request)
                when (i) {
                    11 -> Assertions.assertEquals(HttpStatus.TOO_MANY_REQUESTS, response!!.statusCode)
                }
            }
        }
    }

    @BeforeEach
    fun createUser(){
        val baseUrl = "http://localhost:$port"
        val user = UserDTO(null, "userTest5", "userTest5@test.com", "Passw0rdTest!")
        restTemplate.postForEntity<Any>("$baseUrl/user/register", HttpEntity(user))
    }


}