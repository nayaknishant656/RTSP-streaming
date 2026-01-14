import React from 'react'
import './body.css'

const MOCK_CAMERAS = [
    { id: 1, name: 'Front Entrance', location: 'Main Gate', status: 'Online', resolution: '4K', fps: '30' },
    { id: 2, name: 'Server Room', location: 'B1 Floor', status: 'Online', resolution: '1080p', fps: '60' },
    { id: 3, name: 'Warehouse A', location: 'Storage Area', status: 'Offline', resolution: '720p', fps: '15' },
    { id: 4, name: 'Parking Lot', location: 'Zone 4', status: 'Online', resolution: '1080p', fps: '30' },
    { id: 5, name: 'Office Lobby', location: 'Reception', status: 'Online', resolution: '4K', fps: '24' },
    { id: 6, name: 'Back Alley', location: 'Service Exit', status: 'Online', resolution: '1080p', fps: '30' },
]

export default function Body() {
    return (
        <main className="body-container">
            <section className="hero-section">
                <h1 className="hero-title">Live Streams</h1>
                <p className="hero-subtitle">Monitor all your RTSP camera feeds in real-time.</p>
            </section>

            <div className="camera-grid">
                {MOCK_CAMERAS.map(camera => (
                    <div key={camera.id} className="camera-card">
                        <div className="video-placeholder">
                            <div className="video-overlay">
                                <div className="camera-status">
                                    <span className={`status-dot ${camera.status.toLowerCase()}`}></span>
                                    {camera.status}
                                </div>
                            </div>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#21262d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <div className="camera-info">
                            <h3 className="camera-name">{camera.name}</h3>
                            <div className="camera-location">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                {camera.location}
                            </div>

                            <div className="stream-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Resolution</span>
                                    <span className="meta-value">{camera.resolution}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">FPS</span>
                                    <span className="meta-value">{camera.fps}</span>
                                </div>
                                <button className="btn-view">View Full</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

