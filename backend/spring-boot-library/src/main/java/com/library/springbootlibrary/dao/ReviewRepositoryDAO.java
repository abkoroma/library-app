package com.library.springbootlibrary.dao;

import com.library.springbootlibrary.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepositoryDAO extends JpaRepository<Review, Long> {

    Page<Review> findByBookId(@RequestParam("book_id") Long bookId, Pageable pageable);
    Review findByUserEmailAndBookId(String userEmail, Long bookId);

    @Modifying
    @Query(value = "delete from Review where book_id in :book_id", nativeQuery = true)
    void deleteAllByBookId(@Param("book_id") Long bookId);

}
