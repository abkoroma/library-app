import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import Spinner from "../utils/Spinner";
import StarsReview from "../utils/StarsReview";
import CheckOutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import LatestReviews from "./LatestReview";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModels";
import { useParams } from "react-router-dom";

export default function BookCheckoutPage() {

  const { authState } = useOktaAuth();

  /**Book states */
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  /**Review states */
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  /**loans count state */
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

  /**book checked out states */
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  /**payment */
  const [displayError, setDisplayError] = useState(false);

  //const bookId = (window.location.pathname).split("/")[2];
  const { bookId } = useParams();

  //fetch book
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJson = await response.json();

      const loadedBooks: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        image: responseJson.image,
      };

      setBook(loadedBooks);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [bookId, isCheckedOut]);

  //fetch reviews
  useEffect(() => {
    const fetchBookReviews = async () => {
        const reviewsUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
        const responseReviews = await fetch(reviewsUrl);

        if (!responseReviews.ok) {
          throw new Error('Sometthing went wrong');
        }

        const responseJsonReviews = await responseReviews.json();
        const responseData = responseJsonReviews._embedded.reviews;

        const loadedReviews: ReviewModel[] = [];
        let weightedStarReviews: number = 0;

        for (const key in responseData) {
            loadedReviews.push({
                id: responseData[key].id,
                userEmail: responseData[key].userEmail,
                date: responseData[key].date,
                rating: responseData[key].rating,
                bookId: responseData[key].bookId,
                reviewDescription: responseData[key].reviewDescription,
            });
            weightedStarReviews = weightedStarReviews + responseData[key].rating;
        }
        if (loadedReviews) {
            const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
            setTotalStars(Number(round));
        }

        setReviews(loadedReviews);
        setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });

  }, [bookId]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          }
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error('Something went wrong');
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    }
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState, bookId, isReviewLeft]);

  //fetch book loans
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          }
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error('Something went wrong');
        }
        const currentLoansCountResponseJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    }
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    })
  }, [authState, isCheckedOut]);

  //fetch checkout book
  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const requestOptions ={
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          }
        };
        const bookCheckedOut = await fetch(url, requestOptions);

        if (!bookCheckedOut.ok) {
          console.log('Something went wrong');
        }
        
        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    }
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    })
  }, [authState, bookId]);

  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || 
    isLoadingBookCheckedOut || isLoadingUserReview) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      }
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error('Something went wrong');
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('Something went wrong');
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        {displayError && 
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s).
          </div>
        }
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.image ? (
              <img src={book?.image} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview ratings={totalStars} size={32} />
            </div>
          </div>
          <CheckOutAndReviewBox 
            book={book} mobile={false} currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      {/**Mobile */}
      <div className="container d-lg-none mt-5">
        {displayError && 
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s).
          </div>
        }
        <div className="d-flex justify-content-center align-items-center">
          {book?.image ? (
            <img src={book?.image} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview ratings={totalStars} size={32} />
          </div>
        </div>
        <CheckOutAndReviewBox 
          book={book} mobile={true} currentLoansCount={currentLoansCount} 
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
          checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
}
