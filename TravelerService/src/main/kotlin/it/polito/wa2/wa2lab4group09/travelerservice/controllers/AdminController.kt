package it.polito.wa2.wa2lab4group09.travelerservice.controllers

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.entities.TicketPurchased
import it.polito.wa2.wa2lab4group09.travelerservice.services.AdminService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*


@RestController
class AdminController(val adminService: AdminService) {


    @GetMapping("/admin/travelers")
    suspend fun getTravelers(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelers()
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }


    @GetMapping("/admin/travelers/tickets/purchased")
    suspend fun getTravelersTicketsPurchasedTime(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTicketsPurchased().asFlow()
            }
            else {
                body = adminService.getTicketsPurchasedPeriodOfTime(startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/admin/travelers/tickets/validated")
    suspend fun getTravelersTicketsValidated(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body =adminService.getTicketsValidated()
            }
            else {
                body = adminService.getTicketsValidatedPeriodOfTime(startTime,endTime)
            }
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


    @GetMapping("/admin/traveler/{userID}/tickets/purchased")
    suspend fun getTravelerTicketsPurchasedTime(
        @PathVariable userID:String,
        @RequestParam("start", required=false) startTime: String,
        @RequestParam("end", required=false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body =adminService.getTravelerTickets(userID)
            }
            else {
                body = adminService.getTravelerTicketsPurchasedPeriodOfTime(userID, startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }
    

    @GetMapping("/admin/traveler/{userID}/tickets/validated")
    suspend fun getTravelersTicketsValidatedTime(
        @PathVariable userID:String,
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelerTicketsValidated(userID)
            }
            else {
                body = adminService.getTravelerTicketsValidatedPeriodOfTime(userID, startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

}
