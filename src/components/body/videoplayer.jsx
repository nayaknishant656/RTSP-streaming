import React, { useEffect, useRef, useState } from 'react';

const SERVER_URL = 'http://127.0.0.1:8083';
const UUID = 'default';

function Videoplayer() {
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const [status, setStatus] = useState('Initializing...');
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(true);
    const [errorDetail, setErrorDetail] = useState('');

    useEffect(() => {
        let pc = null;
        let isMounted = true;

        const startWebRTC = async (attempt = 1) => {
            try {
                setErrorDetail('');
                setStatus(`Connecting... (attempt ${attempt})`);

                // Optional: fetch codecs (you can skip if not really used)
                const codecRes = await fetch(`${SERVER_URL}/stream/codec/${UUID}`);
                if (codecRes.ok) {
                    const codecs = await codecRes.json();
                    console.log('[WebRTC] Server codecs:', codecs);
                }

                // Create PeerConnection
                pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                });
                pcRef.current = pc;

                pc.onconnectionstatechange = () => {
                    console.log('[WebRTC] connectionState →', pc.connectionState);
                    if (pc.connectionState === 'connected') {
                        setStatus('Connected ✓');
                    } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                        setStatus('Connection Failed ✗');
                        setErrorDetail('WebRTC connection failed. Check network / server / firewall.');
                    } else {
                        setStatus(pc.connectionState);
                    }
                };

                pc.oniceconnectionstatechange = () =>
                    console.log('[WebRTC] iceConnectionState →', pc.iceConnectionState);

                pc.onicegatheringstatechange = () =>
                    console.log('[WebRTC] iceGatheringState →', pc.iceGatheringState);

                pc.ontrack = (ev) => {
                    console.log('[WebRTC] ontrack →', ev.track.kind, ev.streams);
                    if (videoRef.current && ev.streams?.[0]) {
                        videoRef.current.srcObject = ev.streams[0];
                        console.log('[WebRTC] Video stream attached');
                    }
                };

                // 1. Create offer (tell we want to receive media)
                let offer = await pc.createOffer({
                    offerToReceiveVideo: true,
                    offerToReceiveAudio: true,
                });

                // 2. VERY IMPORTANT for unidirectional streaming:
                // Force recvonly in the offer → server should reply with clean sendonly
                let sdp = offer.sdp
                    .replace(/a=sendrecv/g, 'a=recvonly')
                    .replace(/a=sendonly/g, 'a=recvonly')   // just in case
                    .replace(/a=inactive/g, 'a=recvonly');

                // Optional: remove unused payload types or telephone-event if server chokes
                // sdp = sdp.replace(/m=audio.*\r\n/g, match => match.replace(/ 101/g, '')); // remove telephone-event

                offer = new RTCSessionDescription({
                    type: offer.type,
                    sdp: sdp,
                });

                await pc.setLocalDescription(offer);

                console.log('[Offer] Created & forced recvonly');
                console.log('[Offer] SDP excerpt:\n' + offer.sdp.substring(0, 800) + '...');

                // Wait for ICE gathering (with timeout fallback)
                await new Promise((resolve) => {
                    if (pc.iceGatheringState === 'complete') return resolve();

                    const timeout = setTimeout(() => {
                        console.warn('[ICE] Gathering timeout – using what we have');
                        resolve();
                    }, 4000);

                    const onStateChange = () => {
                        if (pc.iceGatheringState === 'complete') {
                            clearTimeout(timeout);
                            pc.removeEventListener('icegatheringstatechange', onStateChange);
                            resolve();
                        }
                    };
                    pc.addEventListener('icegatheringstatechange', onStateChange);
                });

                if (!isMounted) return;

                const finalOffer = pc.localDescription;

                if (!finalOffer.sdp.includes('ice-ufrag') || !finalOffer.sdp.includes('ice-pwd')) {
                    throw new Error('Generated offer missing ICE credentials');
                }

                // Send offer to server
                const formData = new FormData();
                formData.append('data', btoa(finalOffer.sdp));
                formData.append('suuid', UUID);

                setStatus(`Sending offer... (attempt ${attempt})`);
                const res = await fetch(`${SERVER_URL}/stream/receiver/${UUID}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Server responded ${res.status}: ${errText}`);
                }

                let answerSDP = await res.text();
                console.log(`[Answer] Received (length: ${answerSDP.length})`);

                // Aggressive cleanup of common server mistakes
                answerSDP = answerSDP
                    .trim()
                    .replace(/^\uFEFF/, '')           // BOM
                    .replace(/\r\n?/g, '\n')          // normalize to \n
                    .replace(/\n+/g, '\n')            // remove empty lines
                    .split('\n')
                    .map(line => line.trimEnd())      // no trailing spaces
                    .filter(line => line.length > 0)
                    .join('\r\n') + '\r\n';           // proper WebRTC line endings

                console.log('[Answer] Cleaned SDP excerpt:\n' + answerSDP.substring(0, 800) + '...');

                if (!answerSDP.startsWith('v=0')) {
                    throw new Error(`Answer SDP invalid - does not start with v=0 (length ${answerSDP.length})`);
                }

                // Set remote description
                await pc.setRemoteDescription({
                    type: 'answer',
                    sdp: answerSDP,
                });

                console.log('[WebRTC] setRemoteDescription succeeded');
                setStatus('Negotiation done – waiting for media...');

            } catch (err) {
                console.error(`[WebRTC] Error (attempt ${attempt}):`, err);
                setErrorDetail(err.message || String(err));

                if (pc) pc.close();

                if (attempt < 3 && isMounted) {
                    const delay = 1500 * attempt;
                    setStatus(`Retrying in ${delay / 1000}s...`);
                    setTimeout(() => startWebRTC(attempt + 1), delay);
                } else {
                    setStatus('Failed after retries ✗');
                }
            }
        };

        startWebRTC();

        return () => {
            isMounted = false;
            if (pcRef.current) {
                console.log('[Cleanup] Closing PeerConnection');
                pcRef.current.close();
                pcRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.volume = volume;
        video.muted = muted;

        if (playing) {
            video.play().catch(e => console.warn('Autoplay blocked:', e));
        } else {
            video.pause();
        }
    }, [volume, muted, playing]);

    return (
        <div style={{ position: 'relative', maxWidth: '960px', margin: '2rem auto' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                style={{
                    width: '100%',
                    background: '#111',
                    borderRadius: '8px',
                    minHeight: '400px',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    background: 'rgba(0,0,0,0.7)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    zIndex: 10,
                }}
            >
                <button
                    onClick={() => setPlaying(!playing)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        background: '#444',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    {playing ? '⏸ Pause' : '▶ Play'}
                </button>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.9em' }}>🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        style={{ width: 120 }}
                    />
                    <span style={{ fontSize: '0.9em', minWidth: 35 }}>
                        {Math.round(volume * 100)}%
                    </span>
                </label>

                <button
                    onClick={() => setMuted(!muted)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        background: muted ? '#c44' : '#444',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    {muted ? '🔇 Muted' : '🔊 Unmuted'}
                </button>

                <span style={{ fontSize: '0.9em', opacity: 0.9, marginLeft: 'auto' }}>
                    {status}
                </span>
            </div>

            {errorDetail && (
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        right: 20,
                        background: 'rgba(220,0,0,0.9)',
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '8px',
                        zIndex: 10,
                        fontSize: '0.95em',
                        maxHeight: '220px',
                        overflow: 'auto',
                    }}
                >
                    <strong>❌ Error</strong>
                    <pre
                        style={{
                            margin: '12px 0',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '0.9em',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '8px',
                            borderRadius: '4px',
                        }}
                    >
                        {errorDetail}
                    </pre>
                    <button
                        onClick={() => setErrorDetail('')}
                        style={{
                            padding: '6px 14px',
                            background: 'rgba(255,255,255,0.25)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default Videoplayer;