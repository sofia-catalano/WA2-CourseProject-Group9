package it.polito.wa2.wa2lab4group09.travelerservice.controllers

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.services.AdminService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class AdminController(val adminService: AdminService) {


    @GetMapping("/admin/travelers")
    suspend fun getTravelers(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelers(newToken)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/admin/traveler/{userID}/profile")
    suspend fun getTravelerProfile(@PathVariable userID:String, @RequestHeader("Authorization") jwt:String) :  ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelerProfile(newToken, userID).toDTO()
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/admin/traveler/{userID}/tickets")
    suspend fun getTravelerTickets(@PathVariable userID:String, @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelerTickets(newToken, userID)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }
}
