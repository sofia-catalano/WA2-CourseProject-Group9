package it.polito.wa2.wa2lab4group09.travelerservice.controllers

import it.polito.wa2.wa2lab4group09.travelerservice.dtos.TravelcardOwnerDTO
import it.polito.wa2.wa2lab4group09.travelerservice.dtos.toDTO
import it.polito.wa2.wa2lab4group09.travelerservice.services.UserDetailsService
import kotlinx.coroutines.flow.map
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class MyController(val userDetailsService: UserDetailsService) {

    @GetMapping("/traveler/my/profile")
    suspend fun getUserDetails(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val userDetailsDTO = userDetailsService.getUserDetails(newToken).toDTO()
            //val body = UserDetailsUpdate(userDetailsDTO.name,userDetailsDTO.surname,userDetailsDTO.address,userDetailsDTO.date_of_birth,userDetailsDTO.telephone_number)
            ResponseEntity(userDetailsDTO, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @PutMapping("/traveler/my/profile")
    suspend fun updateUserDetails(@RequestHeader("Authorization") jwt:String, @RequestBody userDetailsUpdate: UserDetailsUpdate) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            userDetailsService.updateUserDetails(newToken,userDetailsUpdate)
            ResponseEntity(HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/my/tickets")
    suspend fun getUserTickets(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = userDetailsService.getUserTickets(newToken).map {
                t-> t.toDTO()
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @PostMapping("/traveler/my/tickets")
    suspend fun buyTickets(@RequestHeader("Authorization") jwt:String, @RequestBody actionTicket: ActionTicket) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = userDetailsService.buyTickets(newToken,actionTicket)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/traveler/my/travelcards")
    suspend fun getUserTravelcards(@RequestHeader("Authorization") jwt:String) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        return try {
            val body = userDetailsService.getUserTravelcards(newToken).map {
                    t-> t.toDTO()
            }
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @PostMapping("/traveler/my/travelcards")
    suspend fun buyTravelcard(@RequestHeader("Authorization") jwt:String, @RequestBody actionTravelcard: ActionTravelcard) : ResponseEntity<Any>{
        val newToken = jwt.replace("Bearer", "")
        println("arrivato")
        return try {
            val body = userDetailsService.buyTravelcards(newToken, actionTravelcard)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.BAD_REQUEST)
        }
    }

    @PostMapping("/traveler/checkTicket")
    suspend fun checkTicket(@RequestBody validationToTravelerService: ValidationToTravelerService) : ResponseEntity<Any>{
        return try {
            val body = userDetailsService.checkTicket(validationToTravelerService)
            ResponseEntity(body, HttpStatus.OK)
        } catch (t : Throwable){
            val error = ErrorMessage(t.message)
            ResponseEntity(error, HttpStatus.OK)
        }
    }

}

data class ActionTicket(val cmd: String, val quantity: Int, val zones: String, val type: String, val typeId: ObjectId)
//to return a JSON-shaped error
data class ErrorMessage(val error: String?)
data class UserDetailsUpdate(val name : String?, val surname : String?, val address : String?, val date_of_birth : String?, val telephone_number : String?)
data class ActionTravelcard(val cmd : String, val zones : String, val type : String, val typeId: ObjectId, val owner: TravelcardOwnerDTO)
data class ValidationToTravelerService(val expiration : Date, val ticketId: String, val zid : String)

