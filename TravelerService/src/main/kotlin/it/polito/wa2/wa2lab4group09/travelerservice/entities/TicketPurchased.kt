package it.polito.wa2.wa2lab4group09.travelerservice.entities

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date
import java.sql.Timestamp


//TODO implement validFrom and type of a ticket

/*
@Entity
@Table(name="ticket_purchased")
class TicketPurchased (
    @Id
    var sub: UUID = UUID.randomUUID(),
    var iat: Timestamp,
    var exp: Timestamp,
    var zid: String,
    var jws: String,
    var typeId : Long,
    @ManyToOne
    @JoinColumn(name = "user_details_username")
    var userDetails: UserDetails? = null
){

}*/

@Document(collection = "ticketPurchased")
data class TicketPurchased(
    @Id
    @Indexed
    var sub : ObjectId = ObjectId.get(),
    var iat: Date,
    var exp: Date? = null,
    var zid: String,
    var jws: String,
    var duration : String,
    var typeId : ObjectId,
    var userId : String,
    var validated:Date ? = null
)
