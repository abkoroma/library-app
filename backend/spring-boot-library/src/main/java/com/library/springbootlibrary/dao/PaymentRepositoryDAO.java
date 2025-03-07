package com.library.springbootlibrary.dao;


import com.library.springbootlibrary.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepositoryDAO extends JpaRepository<Payment, Long> {

    Payment findByUserEmail(String userEmail);
}
