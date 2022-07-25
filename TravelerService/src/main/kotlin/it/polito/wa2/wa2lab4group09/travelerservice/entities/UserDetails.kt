package it.polito.wa2.wa2lab4group09.travelerservice.entities

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document


/*@Entity
@Table(name = "user_details")
class UserDetails(
    @Id
    var username: String,
    var name: String? = null,
    var surname: String? = null,
    var address: String? = null,
    var date_of_birth: String? = null,
    var telephone_number: String? = null,
    var role: Role
) {

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "userDetails")
    val tickets = mutableSetOf<TicketPurchased>()

    fun addTicket(t : TicketPurchased): TicketPurchased {
        t.userDetails = this
        tickets.add(t)
        return t
    }
}*/

@Document(collection = "userDetails")
data class UserDetails(
    @Id
    @Indexed(unique = true)
    var username: String,
    var name: String? = null,
    var surname: String? = null,
    var address: String? = null,
    var date_of_birth: String? = null,
    var telephone_number: String? = null,
    var role: Role
){

}
enum class Role{
    CUSTOMER,ADMIN
}