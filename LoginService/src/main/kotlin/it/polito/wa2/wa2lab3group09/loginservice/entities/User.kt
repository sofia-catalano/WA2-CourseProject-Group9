package it.polito.wa2.wa2lab3group09.loginservice.entities


import org.bson.types.ObjectId
import org.jetbrains.annotations.NotNull
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.constraints.Email
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size

@Document(collection = "users")
data class User (
    @NotNull
    @NotEmpty(message = "Username cannot be empty")
    @Indexed(unique=true)
    val username: String,
    @NotNull
    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\$@\$!%*?&])(?!.*[\\s-]).*\$")
    val password: String,
    @NotNull
    @NotEmpty(message = "Email cannot be empty")
    @Email
    @Indexed(unique=true)
    val email: String,
    val role: Role = Role.CUSTOMER,
    val isActive : Boolean = false,
    @Id
    val id: ObjectId = ObjectId.get()
    )


enum class Role{
    CUSTOMER, ADMIN
}