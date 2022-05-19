package it.polito.wa2.wa2lab3group09.loginservice.entities

import org.jetbrains.annotations.NotNull
import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size

@Entity
@Table(name="users")
class User (
    @NotNull
    @NotEmpty(message = "Username cannot be empty")
    @Column(unique = true)
    var username: String,
    @NotNull
    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\$@\$!%*?&])(?!.*[\\s-]).*\$")
    var password: String,
    @NotNull
    @NotEmpty(message = "Email cannot be empty")
    @Column(unique = true)
    @Email
    var email: String,
    var role: Role = Role.CUSTOMER,
    var isActive : Boolean = false,
    ): EntityBase<Long>()

{

    @OneToOne(mappedBy = "user", cascade = [CascadeType.REMOVE])
    var activation: Activation? = null
}


enum class Role{
    CUSTOMER, ADMIN
}