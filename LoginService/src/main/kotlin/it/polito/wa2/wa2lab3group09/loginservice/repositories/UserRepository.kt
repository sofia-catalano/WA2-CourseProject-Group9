package it.polito.wa2.wa2lab3group09.loginservice.repositories

import it.polito.wa2.wa2lab3group09.loginservice.entities.User
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional


@Repository
interface UserRepository: CrudRepository<User, Long> {

    fun getByUsername(username: String): User?
    fun getByEmail(email: String): User?

    @Modifying
    @Query("update User set username = :username where id = :id")
    fun updateUsername (username:String, id: Long)

    @Modifying
    @Transactional
    @Query("update User set isActive = true where id = :id")
    fun makeActive (id: Long)
}