import React from 'react'
import './header.css'

export default function Header() {
  return (
    <header className="header-container">
      <div className="logo-section">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z"></path>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </div>
        <span className="logo-text">StreamPulse</span>
      </div>

      <nav>
        <ul className="nav-links">
          <li><a href="#" className="nav-link">Dashboard</a></li>
          <li><a href="#" className="nav-link">Cameras</a></li>
          <li><a href="#" className="nav-link">Recordings</a></li>
          <li><a href="#" className="nav-link">Settings</a></li>
        </ul>
      </nav>

      <div className="header-actions">
        <div className="live-badge">
          <span className="pulse"></span>
          Live
        </div>
        <button className="btn-primary">Connect Camera</button>
      </div>
    </header>
  )
}

