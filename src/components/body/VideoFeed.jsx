import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoFeed = ({ src }) => {
    const videoRef = useRef(null);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        // Initialize player
        if (!player) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            const newPlayer = videojs(videoElement, {
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [{
                    src: src,
                    type: 'application/x-mpegURL' // This is for HLS
                }]
            }, () => {
                console.log("player is ready");
            });

            setPlayer(newPlayer);
        } else {
            // Update source if player already exists
            player.src({
                src: src,
                type: 'application/x-mpegURL'
            });
        }
    }, [src, player]);

    useEffect(() => {
        return () => {
            if (player) {
                player.dispose();
                setPlayer(null);
            }
        };
    }, [player]);

    return (
        <div data-vjs-player style={{ width: '100%', height: '100%' }}>
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
};

export default VideoFeed;