import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./Reels.css";

const API_URL = import.meta.env.VITE_API_URL;

const Reels = () => {
  const videoRowRef = useRef(null);
  const [videos, setVideos] = useState([]);

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

        const duplicated = [
          ...videoUrls,
          ...videoUrls,
          ...videoUrls,
          ...videoUrls,
          ...videoUrls,
        ];

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

  const redirectToInstagram = () => {
    window.open(
      "https://www.instagram.com/_indiaculture_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      "_blank"
    );
  };

  return (
    <div className="reels-social-video-sec">
      <h1 className="reels-title text-3xl sm:text-4xl text-green-900 font-bold font-[times] text-center mt-10 mb-10">
        Popular Instagram Videos
      </h1>

      <div className="reels-video-section" ref={videoRowRef}>
        {videos.map((video, index) => (
          <div
            className="reels-video-card"
            key={`${video}-${index}`}
            onClick={redirectToInstagram}         // ✅ ANY click redirects
          >
            <video
              src={video}
              playsInline
              preload="metadata"
              className="reels-video-element"
              muted
              style={{ pointerEvents: "none" }}   // ✅ Disable playback fully
            />

            {/* ✅ Play button also redirects to Instagram */}
            <button
              className="reels-play-button"
              onClick={(e) => {
                e.stopPropagation(); // avoid double trigger
                redirectToInstagram();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="reels-play-svg"
              >
                <path d="M5 3l16 9-16 9V3z" fill="#fff" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
