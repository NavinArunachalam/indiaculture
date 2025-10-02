import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./Reels.css";

const API_URL = import.meta.env.VITE_API_URL;

const Reels = () => {
  const videoRowRef = useRef(null);
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [videos, setVideos] = useState([]);

  // Fetch reels from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/reels`);
        // Map data to only video URLs
        const videoUrls = data
          .map((reel) => reel.media[0]?.url)
          .filter((url) => url); // remove nulls
        // Optional: duplicate for scrolling effect
        const duplicated = [...videoUrls, ...videoUrls, ...videoUrls,...videoUrls,...videoUrls];
        setVideos(duplicated);
      } catch (err) {
        console.error("Failed to fetch reels:", err);
      }
    };

    fetchVideos();
  }, []);

  const handleMouseEnter = () => {
    videoRowRef.current?.classList.add("paused");
  };

  const handleMouseLeave = () => {
    if (playingIndex === null) videoRowRef.current?.classList.remove("paused");
  };

  const togglePlay = async (index) => {
    const clickedVideo = videoRefs.current[index];
    if (!clickedVideo) return;

    try {
      // Pause all other videos
      for (let i = 0; i < videoRefs.current.length; i++) {
        if (i !== index && videoRefs.current[i] && !videoRefs.current[i].paused) {
          await videoRefs.current[i].pause();
        }
      }

      if (clickedVideo.paused || clickedVideo.ended) {
        await clickedVideo.play();
        setPlayingIndex(index);
        videoRowRef.current?.classList.add("paused");
      } else {
        clickedVideo.pause();
        setPlayingIndex(null);
        videoRowRef.current?.classList.remove("paused");
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  };

  const handleEnded = () => {
    setPlayingIndex(null);
    videoRowRef.current?.classList.remove("paused");
  };

  return (
    <div className="social-video-sec">
      <h1 className="text-2xl sm:text-4xl text-green-900 font-bold font-[times] text-center mt-10 mb-10">
        Popular Instagram Videos
      </h1>
      <div
        className="video-section"
        ref={videoRowRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {videos.map((video, index) => (
          <div className="video-card" key={`${video}-${index}`}>
            <video
              src={video}
              ref={(el) => (videoRefs.current[index] = el)}
              playsInline
              preload="metadata"
              onClick={() => togglePlay(index)}
              onEnded={handleEnded}
              className="video-element"
            />
            {playingIndex !== index && (
              <div className="play-icon" onClick={() => togglePlay(index)}>
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
