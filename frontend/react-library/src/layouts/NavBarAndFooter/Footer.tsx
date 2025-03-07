import { Link } from "react-router-dom";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Footer() {
    return (
        <div className="main-color">
            <footer className="container d-flex flex-wrap justify-content-between align-items-centerpy-5 main-color">
                <p className="col-md-4 mb-0 text-white">
                    &copy; Example Library App, Inc
                </p>
                <ul className="nav navbar-dark col-md-4 justify-content-end">
                    <li className="nav-item">
                        <Link to="/" className="nav-link px-2 text-white">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/search" className="nav-link px-2 text-white">Search Books</Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
}