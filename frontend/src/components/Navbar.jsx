import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import Uskillbook from "../assets/uskillbook.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="navbar">
        <div className="logoText">
          <img src={Uskillbook} alt="Uskillbook Logo" />
          <span>Uskillbook</span>
        </div>

        {/* Desktop Menu */}
        <div className="menus">
          <Link to="/">Home</Link>
          <Link to="/cashflow">Cashflow</Link>
          <Link to="/dealers">Dealers</Link>
          <Link to="/needs-orders">Book Order</Link>
          <Link to="/transaction-history">History</Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
        <span className="material-symbols-outlined">
filter_list
</span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "show" : ""}`}>
        <Link to="/" onClick={toggleMobileMenu}>Home</Link>
        <Link to="/cashflow" onClick={toggleMobileMenu}>Cashflow</Link>
        <Link to="/dealers" onClick={toggleMobileMenu}>Dealers</Link>
        <Link to="/needs-orders" onClick={toggleMobileMenu}>Book Order</Link>
        <Link to="/transaction-history" onClick={toggleMobileMenu}>History</Link>
      </div>
    </>
  );
};

export default Navbar;
