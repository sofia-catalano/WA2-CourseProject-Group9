package it.polito.wa2.wa2lab3group09.repositories

import it.polito.wa2.wa2lab3group09.entities.Activation
import it.polito.wa2.wa2lab3group09.entities.User
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*


@Repository
interface ActivationRepository: CrudRepository<Activation, UUID>{

    fun getByUser(user : User) : Activation?

    fun getById(id: UUID): Activation?

    @Query("select A.user from Activation A where A.id = :uuid")
    fun getUserByUUID (uuid: UUID) : User

    @Transactional
    @Modifying
    @Query("update Activation set attemptCounter = attemptCounter - 1 where id = :uuid")
    fun reduceAttempt (uuid: UUID)

    @Query("select user.id from Activation where expirationDate < CURRENT_TIMESTAMP ")
    fun getExpiredUserIDs(): List<Long>

}