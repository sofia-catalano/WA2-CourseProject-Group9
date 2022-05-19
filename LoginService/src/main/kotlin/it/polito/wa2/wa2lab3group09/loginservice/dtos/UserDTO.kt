package it.polito.wa2.wa2lab3group09.loginservice.dtos
import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import org.jetbrains.annotations.NotNull
import javax.validation.constraints.Email
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size

data class UserDTO(
    val id: Long?,
    @field:NotNull
    @field:Size(min = 1)
    val username: String,
    @field:NotNull
    @field:Size(min = 1)
    @field:Email
    val email: String,
    @field:NotNull
    @field:Size(min = 8)
    @field:Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\$@\$!%*?&])(?!.*[\\s-]).*\$")
    val password: String
)

fun User.toDTO() : UserDTO {
    return UserDTO(getId(), username, email, password)
}
