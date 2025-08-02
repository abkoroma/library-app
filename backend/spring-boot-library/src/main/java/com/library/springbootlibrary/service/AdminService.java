package com.library.springbootlibrary.service;

import com.library.springbootlibrary.dao.BookRepositoryDAO;
import com.library.springbootlibrary.dao.CheckoutRepositoryDAO;
import com.library.springbootlibrary.dao.ReviewRepositoryDAO;
import com.library.springbootlibrary.entity.Book;
import com.library.springbootlibrary.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private BookRepositoryDAO bookRepositoryDAO;
    private ReviewRepositoryDAO reviewRepositoryDAO;
    private CheckoutRepositoryDAO checkoutRepositoryDAO;

    @Autowired
    public AdminService(BookRepositoryDAO bookRepositoryDAO,
                        ReviewRepositoryDAO reviewRepositoryDAO,
                        CheckoutRepositoryDAO checkoutRepositoryDAO) {
        this.bookRepositoryDAO = bookRepositoryDAO;
        this.reviewRepositoryDAO = reviewRepositoryDAO;
        this.checkoutRepositoryDAO = checkoutRepositoryDAO;
    }

    public void increaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepositoryDAO.findById(bookId);

        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepositoryDAO.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepositoryDAO.findById(bookId);

        if (!book.isPresent() || book.get().getCopiesAvailable() <= 0 ||
            book.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepositoryDAO.save(book.get());
    }

    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImage(addBookRequest.getImg());

        bookRepositoryDAO.save(book);
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepositoryDAO.findById(bookId);

        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }

        bookRepositoryDAO.delete(book.get());
        reviewRepositoryDAO.deleteAllByBookId(bookId);
        checkoutRepositoryDAO.deleteAllByBookId(bookId);
    }
}
