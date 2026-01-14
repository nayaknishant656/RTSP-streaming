import React from 'react'
import './footer.css'
import '../header/header.css' // Re-using logo-section and logo-text styles

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <span className="logo-text">StreamPulse</span>
          </div>
          <p className="footer-description">
            Next-generation RTSP streaming platform for professional surveillance and monitoring solutions.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li className="footer-link-item"><a href="#" className="footer-link">Dashboard</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Cloud Storage</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Edge Computing</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">API Access</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li className="footer-link-item"><a href="#" className="footer-link">Documentation</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Help Center</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Contact Us</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Status</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li className="footer-link-item"><a href="#" className="footer-link">About Us</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Careers</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Privacy Policy</a></li>
            <li className="footer-link-item"><a href="#" className="footer-link">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 StreamPulse Inc. All rights reserved.</p>
        <div className="social-links">
          <a href="#" className="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" className="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" className="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

