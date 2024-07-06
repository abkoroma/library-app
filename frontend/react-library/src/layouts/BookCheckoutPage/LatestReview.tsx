import { Fragment } from "react";
import ReviewModel from "../../models/ReviewModel";
import { Link } from "react-router-dom";
import Review from "../utils/Review";

export default function LatestReviews(props: {
  reviews: ReviewModel[];
  bookId: number | undefined;
  mobile: boolean;
}) {
  return (
    <div className={props.mobile ? "mt-3" : "row mt-5"}>
      <div className={props.mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>Latest Reviews: </h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {props.reviews.length > 0 ? (
          <Fragment>
            {props.reviews.slice(0, 3).map((review) => (
              <Review key={review.id} review={review} />
            ))}

            <div className="m-3">
              <Link
                type="button"
                className="btn btn-primary main-color btnmd text-white"
                to={`/reviewlist/${props.bookId}`}
              >
                Reach all reviews
              </Link>
            </div>
          </Fragment>
        ) : (
          <div className="m-3">
            <p className="lead">Currently there are no reviews for this book</p>
          </div>
        )}
      </div>
    </div>
  );
}
