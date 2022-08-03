package it.polito.wa2.wa2lab3group09.loginservice.controllers

import it.polito.wa2.wa2lab3group09.loginservice.dtos.UserDTO
import it.polito.wa2.wa2lab3group09.loginservice.security.JwtUtils
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.BindingResult
import javax.validation.Valid
import it.polito.wa2.wa2lab3group09.loginservice.services.AdminService
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.*

@RestController
class AdminController(val adminService: AdminService) {

    @Value("\${application.jwt.jwtSecret}")
    lateinit var key: String

    @PostMapping("/admin/registerAdmin")
    suspend fun registerAdmin(@RequestHeader("Authorization") jwt:String,
                              @RequestBody
                              userDTO: UserDTO)
                             : ResponseEntity<Any>{
        println("REGISTER ADMIN")
        /*if (br.hasErrors()) {
            val body = ErrorMessage("Username or password are invalid!")
            return ResponseEntity(body, HttpStatus.BAD_REQUEST)
        }*/

        return try {
            val newToken = jwt.replace("Bearer", "")
            val username=JwtUtils.getDetailsFromJwtToken(newToken, key).username
            if (adminService.createAdmin(username, userDTO)!=null){
                ResponseEntity(HttpStatus.ACCEPTED)
            }
            else{
                val body = ErrorMessage("Something goes wrong!")
                return ResponseEntity(body, HttpStatus.BAD_REQUEST)
            }
        } catch (t: Throwable) {
            val body = ErrorMessage("Username or email already used!")
            ResponseEntity(body, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/admin/enrollAdmin/{admin}")
    suspend fun enrollAdmin(@PathVariable admin:String, @RequestHeader("Authorization") jwt:String) :  ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        val username=JwtUtils.getDetailsFromJwtToken(newToken, key).username
        return try {
            adminService.enrollAdmin(username, admin)
            ResponseEntity(HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

}
