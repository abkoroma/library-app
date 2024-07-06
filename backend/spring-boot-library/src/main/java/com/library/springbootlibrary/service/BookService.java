package com.library.springbootlibrary.service;

import com.library.springbootlibrary.dao.BookRepositoryDAO;
import com.library.springbootlibrary.dao.CheckoutRepositoryDAO;
import com.library.springbootlibrary.dao.HistoryRepositoryDAO;
import com.library.springbootlibrary.dao.PaymentRepositoryDAO;
import com.library.springbootlibrary.entity.Book;
import com.library.springbootlibrary.entity.Checkout;
import com.library.springbootlibrary.entity.History;
import com.library.springbootlibrary.entity.Payment;
import com.library.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.spi.LocaleServiceProvider;

@Service
@Transactional
public class BookService {
    private BookRepositoryDAO bookRepositoryDAO;
    private CheckoutRepositoryDAO checkoutRepositoryDAO;
    private HistoryRepositoryDAO historyRepositoryDAO;
    private PaymentRepositoryDAO paymentRepositoryDAO;

    @Autowired
    public BookService(BookRepositoryDAO bookRepositoryDAO,
                       CheckoutRepositoryDAO checkoutRepositoryDAO,
                       HistoryRepositoryDAO historyRepositoryDAO,
                       PaymentRepositoryDAO paymentRepositoryDAO) {
        this.bookRepositoryDAO = bookRepositoryDAO;
        this.checkoutRepositoryDAO = checkoutRepositoryDAO;
        this.historyRepositoryDAO = historyRepositoryDAO;
        this.paymentRepositoryDAO = paymentRepositoryDAO;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        //optional book from the database
        Optional<Book> book = bookRepositoryDAO.findById(bookId);

        //validating the book in the database through email and book id
        Checkout validateCheckout = checkoutRepositoryDAO.findByUserEmailAndBookId(userEmail, bookId);

        //check if the book is not null
        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        //validate books checked out
        List<Checkout> currentBooksCheckedOut = checkoutRepositoryDAO.findBooksByUserEmail(userEmail);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsReturned = false;

        for (Checkout checkout : currentBooksCheckedOut) {
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

            if (differenceInTime < 0) {
                bookNeedsReturned = true;
                break;
            }
        }

        Payment userPayment = paymentRepositoryDAO.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) ||
                (userPayment != null && bookNeedsReturned)) {
            throw new Exception("Outstanding fees");
        }

        if (userPayment != null) {
            Payment payment = new Payment();
            payment.setAmount((long) 00.00);
            payment.setUserEmail(userEmail);
            paymentRepositoryDAO.save(payment);
        }

        // set the copies available - 1 and save the new book
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepositoryDAO.save(book.get());

        //create a new checkout record
        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        //save record to the database
        checkoutRepositoryDAO.save(checkout);

        //returns the book
        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        //validating the book in the database through email and book id
        Checkout validateCheckout = checkoutRepositoryDAO.findByUserEmailAndBookId(userEmail, bookId);

        //check if the book is not null
        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepositoryDAO.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepositoryDAO.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for (Checkout i : checkoutList) {
            bookIdList.add(i.getBookId());
        }

        List<Book> books = bookRepositoryDAO.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long differenceInTime = time.convert(d1.getTime() - d2.getTime(),
                        TimeUnit.MILLISECONDS
                );

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) differenceInTime));

            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepositoryDAO.findById(bookId);

        Checkout validateCheckout = checkoutRepositoryDAO.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepositoryDAO.save(book.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if (differenceInTime < 0) {
            Payment payment = paymentRepositoryDAO.findByUserEmail(userEmail);

            payment.setAmount((long) (payment.getAmount() + (differenceInTime * -1)));
            paymentRepositoryDAO.save(payment);
        }

        checkoutRepositoryDAO.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImage()
        );

        historyRepositoryDAO.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepositoryDAO.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepositoryDAO.save(validateCheckout);
        }
    }

}
