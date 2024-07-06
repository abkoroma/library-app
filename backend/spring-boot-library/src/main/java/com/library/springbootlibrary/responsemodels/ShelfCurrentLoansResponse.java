package com.library.springbootlibrary.responsemodels;

import com.library.springbootlibrary.entity.Book;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class ShelfCurrentLoansResponse {
    private Book book;
    private int daysLeft;

    @Autowired
    public ShelfCurrentLoansResponse(Book book, int daysLeft) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
}
