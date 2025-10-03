import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./Reels.css";

const API_URL = import.meta.env.VITE_API_URL;

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Reels = () => {
  const videoRowRef = useRef(null);
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isToggling, setIsToggling] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/reels`, {
          signal: controller.signal,
        });
        const videoUrls = data
          .map((reel) => reel.media[0]?.url)
          .filter((url) => url);
        const duplicated = [...videoUrls, ...videoUrls, ...videoUrls, ...videoUrls, ...videoUrls];
        setVideos(duplicated);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch reels:", err);
        }
      }
    };

    fetchVideos();

    return () => controller.abort();
  }, []);

  const memoizedVideos = useMemo(() => videos, [videos]);

  const handleMouseEnter = useCallback(() => {
    videoRowRef.current?.classList.add("reels-paused");
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (playingIndex === null) videoRowRef.current?.classList.remove("reels-paused");
  }, [playingIndex]);

  const togglePlay = useCallback(
    debounce(async (index) => {
      setIsToggling((prev) => ({ ...prev, [index]: true }));
      const clickedVideo = videoRefs.current[index];
      if (!clickedVideo) {
        setIsToggling((prev) => ({ ...prev, [index]: false }));
        return;
      }

      const isPaused = clickedVideo.paused || clickedVideo.ended;
      setPlayingIndex(isPaused ? index : null);
      videoRowRef.current?.classList.toggle("reels-paused", isPaused);

      try {
        for (let i = 0; i < videoRefs.current.length; i++) {
          if (i !== index && videoRefs.current[i] && !videoRefs.current[i].paused) {
            await videoRefs.current[i].pause();
          }
        }

        if (isPaused) {
          await clickedVideo.play();
        } else {
          await clickedVideo.pause();
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Video playback error:", err);
          setPlayingIndex(playingIndex);
          videoRowRef.current?.classList.toggle("reels-paused", playingIndex !== null);
        }
      } finally {
        setIsToggling((prev) => ({ ...prev, [index]: false }));
      }
    }, 200),
    [playingIndex]
  );

  const handleEnded = useCallback(() => {
    setPlayingIndex(null);
    setIsToggling((prev) => ({ ...prev, [playingIndex]: false }));
    videoRowRef.current?.classList.remove("reels-paused");
  }, [playingIndex]);

  return (
    <div className="reels-social-video-sec">
      <h1 className="reels-title text-3xl sm:text-4xl text-green-900 font-bold font-[times] text-center mt-10 mb-10">
        Popular Instagram Videos
      </h1>
      <div
        className="reels-video-section"
        ref={videoRowRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {memoizedVideos.map((video, index) => (
          <div className="reels-video-card" key={`${video}-${index}`}>
            <video
              src={video}
              ref={(el) => (videoRefs.current[index] = el)}
              playsInline
              preload="metadata"
              onClick={() => togglePlay(index)}
              onEnded={handleEnded}
              className="reels-video-element"
            />
            {playingIndex !== index && (
              <div
                className={`reels-play-icon ${isToggling[index] ? "reels-toggling" : ""}`}
                onClick={() => togglePlay(index)}
              >
                &#9658;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;