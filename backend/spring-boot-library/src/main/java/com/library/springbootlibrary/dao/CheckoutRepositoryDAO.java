package com.library.springbootlibrary.dao;

import com.library.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepositoryDAO extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);
    List<Checkout> findBooksByUserEmail(String userEmail);

    @Modifying
    @Query(value = "delete from Checkout where book_id in :book_id", nativeQuery = true)
    void deleteAllByBookId(@Param("book_id") Long bookId);

}
