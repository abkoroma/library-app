import { NavLink } from "react-router-dom";
import Spinner from "../utils/Spinner";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Navbar() {
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loginWithRedirect, logout, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const fetchRoles = async () => {
      const claims = await getIdTokenClaims();
      const fetchedRoles = claims?.['https://luv2code-react-library.com/roles'] || [];
      setRoles(fetchedRoles);
      setLoading(false);
    }

    fetchRoles();
  }, [isAuthenticated, getIdTokenClaims]);

  if (loading) {
    return <Spinner />
  }

  function handleLogout() {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  function handleLogin() {
    loginWithRedirect();
    window.location.assign('/');
  }

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
              <NavLink className="nav-link" to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search Books
              </NavLink>
            </li>
            {isAuthenticated && roles?.includes('admin') &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/shelf">
                  Shelf
                </NavLink>
              </li>
            }
            {isAuthenticated && roles?.includes('admin') &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            }
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item m-1">
                <button type="button" className="btn btn-outline-light"onClick={handleLogin}>
                  Sign in
                </button>
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
