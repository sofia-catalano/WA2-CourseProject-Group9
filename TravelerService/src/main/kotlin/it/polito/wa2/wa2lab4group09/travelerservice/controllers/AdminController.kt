package it.polito.wa2.wa2lab4group09.travelerservice.controllers

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TicketPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TravelcardPurchasedDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.services.AdminService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class AdminController(val adminService: AdminService) {


    @GetMapping("/traveler/admin/travelers")
    suspend fun getTravelers(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelers()
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }


    @GetMapping("/traveler/admin/travelers/tickets/purchased")
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

    @GetMapping("/traveler/admin/travelers/tickets/validated")
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
    @GetMapping("/traveler/admin/travelers/tickets/valid")
    suspend fun getTravelersTicketsValid(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body =adminService.getTicketsValid()
            }
            else {
                body = adminService.getTicketsValidPeriodOfTime(startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }
    @GetMapping("/traveler/admin/travelers/tickets/expired")
    suspend fun getTravelersTicketsExpired(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTicketsExpired()
            }
            else {
                body = adminService.getTicketsExpiredPeriodOfTime(startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            println(t)
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }



    @GetMapping("/traveler/admin/traveler/{userID}/profile")
    suspend fun getTravelerProfile(@PathVariable userID:String, @RequestHeader("Authorization") jwt:String) :  ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = adminService.getTravelerProfile(newToken, userID).toDTO()
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }


    @GetMapping("/traveler/admin/traveler/{userID}/tickets/purchased")
    suspend fun getTravelerTicketsPurchasedTime(
        @PathVariable userID:String,
        @RequestParam("start", required=false) startTime: String,
        @RequestParam("end", required=false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body =adminService.getTravelerTickets(userID).map {
                    t->t.toDTO()
                }
            }
            else {
                body = adminService.getTravelerTicketsPurchasedPeriodOfTime(userID, startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }


    @GetMapping("/traveler/admin/traveler/{userID}/tickets/validated")
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
    @GetMapping("/traveler/admin/traveler/{userID}/tickets/valid")
    suspend fun getTravelersTicketsValidTime(
        @PathVariable userID:String,
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelerTicketsValid(userID)
            }
            else {
                body = adminService.getTravelerTicketsValidPeriodOfTime(userID, startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }
    @GetMapping("/traveler/admin/traveler/{userID}/tickets/expired")
    suspend fun getTravelersTicketsExpiredTime(
        @PathVariable userID:String,
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TicketPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelerTicketsExpired(userID)
            }
            else {
                body = adminService.getTravelerTicketsExpiredPeriodOfTime(userID, startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }
    @GetMapping("/traveler/admin/travelers/travelcards/purchased")
    suspend fun getTravelersTravelcardsPurchasedTime(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TravelcardPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelcardsPurchased().asFlow()
            }
            else {
                body = adminService.getTravelcardsPurchasedPeriodOfTime(startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/admin/travelers/travelcards/expired")
    suspend fun getTravelersTravelcardsExpiredTime(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TravelcardPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelcardsExpired()
            }
            else {
                body = adminService.getTravelcardsExpiredPeriodOfTime(startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/admin/travelers/travelcards/valid")
    suspend fun getTravelersTravelcardsValid(
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TravelcardPurchasedDTO>
            if(startTime==null && endTime==null){
                body =adminService.getTravelcardsValid()
            }
            else {
                body = adminService.getTravelcardsValidPeriodOfTime(startTime,endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }


    @GetMapping("/traveler/admin/traveler/{userID}/travelcards/purchased")
    suspend fun getTravelerTravelcardsPurchasedTime(
        @PathVariable userID:String,
        @RequestParam("start", required=false) startTime: String,
        @RequestParam("end", required=false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TravelcardPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelerTravelcards(userID).map {
                        t->t.toDTO()
                }
            }
            else {
                body = adminService.getTravelerTravelcardsPurchasedPeriodOfTime(userID, startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/admin/traveler/{userID}/travelcards/expired")
    suspend fun getTravelerTravelcardsExpiredTime(
        @PathVariable userID:String,
        @RequestParam("start", required=false) startTime: String,
        @RequestParam("end", required=false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            //val body : Flow<TravelcardPurchasedDTO>null
            /*if(startTime==null && endTime==null){
                body = adminService.getTravelerTravelcardsExpired(userID)
            }
            else {
                body = adminService.getTravelerTravelcardsExpiredPeriodOfTime(userID, startTime, endTime)
            }*/
            ResponseEntity(null, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/admin/traveler/{userID}/travelcards/valid")
    suspend fun getTravelersTravelcardsValidTime(
        @PathVariable userID:String,
        @RequestParam("start", required = false) startTime: String,
        @RequestParam("end", required = false) endTime: String,
        @RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        return try {
            val body : Flow<TravelcardPurchasedDTO>
            if(startTime==null && endTime==null){
                body = adminService.getTravelerTravelcardsValid(userID)
            }
            else {
                body = adminService.getTravelerTravelcardsValidPeriodOfTime(userID, startTime, endTime)
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            ResponseEntity("${t.message}", HttpStatus.BAD_REQUEST)
        }
    }

}
