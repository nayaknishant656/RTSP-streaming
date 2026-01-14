import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import VideoFeed from './VideoFeed'
import './videoplayer.css'

const MOCK_CAMERAS = [
    { id: 1, name: 'Main Movie Feed', location: 'External', status: 'Online', resolution: '4K', fps: '30', bitrate: '12 Mbps', codec: 'H.264', src: 'rtsp://rtspstream:YF47C9vEiZYVj2_naQK6P@zephyr.rtsp.stream/movie' },
    { id: 2, name: 'Test Pattern 1', location: 'Internal', status: 'Online', resolution: '1080p', fps: '60', bitrate: '8 Mbps', codec: 'H.265', src: 'rtsp://rtspstream:YF47C9vEiZYVj2_naQK6P@zephyr.rtsp.stream/pattern' },
    { id: 3, name: 'Test Pattern 2', location: 'Internal', status: 'Online', resolution: '720p', fps: '15', bitrate: '4 Mbps', codec: 'H.264', src: 'rtsp://rtspstream:YF47C9vEiZYVj2_naQK6P@zephyr.rtsp.stream/pattern2' },
    { id: 4, name: 'Public Square', location: 'City Center', status: 'Online', resolution: '1080p', fps: '30', bitrate: '6 Mbps', codec: 'H.264', src: 'rtsp://rtspstream:YF47C9vEiZYVj2_naQK6P@zephyr.rtsp.stream/people' },
    { id: 5, name: 'Highway Traffic', location: 'North Exit', status: 'Online', resolution: '4K', fps: '24', bitrate: '14 Mbps', codec: 'H.265', src: 'rtsp://rtspstream:YF47C9vEiZYVj2_naQK6P@zephyr.rtsp.stream/traffic' },
]

export default function VideoPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const camera = MOCK_CAMERAS.find(c => c.id === parseInt(id)) || MOCK_CAMERAS[0];

    return (
        <div className="player-container">
            <button className="back-button" onClick={() => navigate('/')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Dashboard
            </button>

            <div className="player-main">
                <div className="video-wrapper">
                    <iframe
                        width="100%"
                        height="100%"
                        src="http://127.0.0.1:8083/stream/player/H264_AAC"
                        frameBorder="0"
                        allowFullScreen
                        title="RTSP Stream"
                        style={{ border: 'none' }}
                    ></iframe>
                </div>


                <div className="player-controls">
                    <div className="camera-title-section">
                        <h1>{camera.name}</h1>
                        <div className="camera-meta-flat">
                            <span>{camera.location}</span>
                            <span>•</span>
                            <span>{camera.status}</span>
                        </div>
                    </div>

                    <div className="player-actions">
                        <button className="btn-secondary">Snapshot</button>
                        <button className="btn-primary">Record Clip</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

