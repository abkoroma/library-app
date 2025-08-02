import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function LibraryServices() {

    const { isAuthenticated } = useAuth0();

    return (
        <div className="container my-5">
            <div className="row p-4 align-items-center border shadow-lg">
                <div className="col-lg-7 p-3">
                    <h1 className="display-4 fw-bold">Can't find what you are looking for?</h1>
                    <p className="lead">
                        If you can't find what you're looking for,
                        send our library admin's a personal message!
                    </p>
                    <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
                        {isAuthenticated ?
                            <Link 
                                to='/messages'
                                type="button" 
                                className="btn btn-primary main-color btn-lg px-4 me-md-2 fw-bold text-white"
                            >
                                Library Services
                            </Link> :
                            <Link 
                                className="btn btn-primary main-color btn-lg text-white" 
                                to="/login"
                            >
                                Sign up
                            </Link>
                        }
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 shadow-lg lost-image">

                </div>
            </div>
        </div>
    )
}