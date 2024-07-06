import { NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import Spinner from "../utils/Spinner";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Navbar() {
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
    return <Spinner />;
  }

  const handleLogout = async () => oktaAuth.signOut();
  //console.log(authState);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Luv 2 Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search Books
              </NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/shelf">
                  Shelf
                </NavLink>
              </li>
            }
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/fees">
                  Pay fees
                </NavLink>
              </li>
            }
            {authState.isAuthenticated && 
              authState.accessToken?.claims?.userType === 'admin' &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            }
          </ul>
          <ul className="navbar-nav ms-auto">
            {!authState.isAuthenticated ? (
              <li className="nav-item m-1">
                <NavLink type="button" className="btn btn-outline-light" to='/login'>
                  Sign in
                </NavLink>
              </li>
            ) : (
              <li>
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
