import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <img
            src="logo.png" // Replace with your logo's file path or URL
            alt="IMT Logo"
            className="footer-logo"
          />
          <p>Shaping futures in Technology and Management since 1973</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>About IMT</h4>
            <ul>
              <li>
                <a href="/about">About IMT</a>
              </li>
              <li>
                <a href="/leadership">Leadership</a>
              </li>
              <li>
                <a href="/news">News</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Academics</h4>
            <ul>
              <li>
                <a href="/programmes">Programmes</a>
              </li>
              <li>
                <a href="/course-registration">Course Registration</a>
              </li>
              <li>
                <a href="/academic-policies">Academic Policies</a>
              </li>
              <li>
                <a href="/academic-calendar">Academic Calendar</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Admissions</h4>
            <ul>
              <li>
                <a href="/admission-process">Admission Process</a>
              </li>
              <li>
                <a href="/find-a-course">Find a Course</a>
              </li>
              <li>
                <a href="/apply">Apply</a>
              </li>
              <li>
                <a href="/result-checker">Admission Result Checker</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
