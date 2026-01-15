import React, { useEffect, useRef, useState } from 'react';

const SERVER_URL = 'http://localhost:8083'; // Your Go server
const UUID = 'people'; // Your stream UUID

function WebRTCPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const pcRef = useRef(null);

  useEffect(() => {
    const startWebRTC = async () => {
      // 1. Get codecs from server
      const codecRes = await fetch(`${SERVER_URL}/stream/codec/${UUID}`);
      const codecs = await codecRes.json(); // [{Type: "video"}, {Type: "audio"}]

      // 2. Create PeerConnection
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Match your config ICE servers
      });

      // Receive remote tracks
      pcRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // 3. Create offer
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pcRef.current.setLocalDescription(offer);

      // 4. Send offer to server via POST
      const formData = new FormData();
      formData.append('data', btoa(JSON.stringify(offer))); // base64 SDP
      formData.append('suuid', UUID);

      const answerRes = await fetch(`${SERVER_URL}/stream/receiver/${UUID}`, {
        method: 'POST',
        body: formData,
      });
      const answerSDP = await answerRes.text();

      // 5. Set remote description
      await pcRef.current.setRemoteDescription({
        type: 'answer',
        sdp: atob(answerSDP), // decode base64
      });

      // Optional: Handle ICE candidates if needed (server may send via data channel)
    };

    startWebRTC().catch(console.error);

    return () => {
      pcRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{ width: '100%', height: 'auto' }}
      />

      {/* Custom controls overlay */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0,0,0,0.6)',
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        display: 'flex',
        gap: '12px',
        zIndex: 10
      }}>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
        />
        <button onClick={() => setMuted(!muted)}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {/* Custom image overlay (e.g., watermark/logo) */}
      <img
        src="https://your-logo-url.com/logo.png"
        alt="Watermark"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: '100px',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default WebRTCPlayer;