import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function ProductLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/CreateProduct">
                  Product
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/SignUp">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/AboutUs">
                  AboutUs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container pt-3">
        <Outlet />
      </div>
    </>
  );
}

export default ProductLayout;
