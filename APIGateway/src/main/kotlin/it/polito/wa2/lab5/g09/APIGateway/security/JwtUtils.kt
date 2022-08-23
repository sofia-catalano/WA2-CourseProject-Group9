package it.polito.wa2.lab5.g09.APIGateway.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys

object JwtUtils {

    fun validateJwtToken (authToken: String, key: String): Boolean{
        try {
            //jwt automatically control that the expiry timestamp (named “exp”) is still valid
            Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(key.toByteArray())).build().parseClaimsJws(authToken)
            return true
        }catch (e : JwtException){
            println("${e.message}")
            throw IllegalArgumentException("${e.message}")
        }
    }


    fun getDetailsFromJwtToken (authToken: String, key : String): UserDetailsDTO{
        try {
            //jwt automatically control that the expiry timestamp (named “exp”) is still valid
            val jwt = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(key.toByteArray())).build().parseClaimsJws(authToken)
            val subject = jwt.body.subject
            val role = if(jwt.body["role"]=="CUSTOMER") Role.CUSTOMER else Role.ADMIN
            return UserDetailsDTO(subject, role = role)

        }catch (e : JwtException){
            throw IllegalArgumentException("${e.message}")
        }
    }
}

data class UserDetailsDTO(val username : String, val role : Role)

enum class Role{
    CUSTOMER,ADMIN
}
