/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

export default function ReturnBook(props: { book: BookModel}) {
  return (
    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div className="text-center">
        {props.book.image ?
          (
            <img
              src={props.book.image}
              width="151"
              height="233"
              alt="book"
            />
          ) :
          (
            <img
              src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
              width="151"
              height="233"
              alt="book"
            />
          )
        }
        <h6 className="mt-2">{ props.book.title }</h6>
        <p>{ props.book.author }</p>
        <Link 
          className="btn btn-primary main-color text-white" 
          to={`checkout/${props.book.id}`} 
          style={{cursor: "pointer"}}>
          Reserve
        </Link>
      </div>
    </div>
  );
}
