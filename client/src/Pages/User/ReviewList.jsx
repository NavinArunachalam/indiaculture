import React, { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Lazy } from "swiper/modules";
import useSWR from "swr";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const fetcher = url => axios.get(url, { withCredentials: true }).then(res => res.data.data);

const Reviews = () => {
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Check for session cookie (adjust cookie name as needed)
  useEffect(() => {
    const checkSession = () => {
      // Replace 'sessionid' with your actual cookie name, or use a generic check
      const hasCookie = document.cookie.includes("sessionid");
      setIsSessionReady(hasCookie);
    };
    checkSession();
    // Poll briefly to handle async cookie setting
    const interval = setInterval(checkSession, 500);
    return () => clearInterval(interval);
  }, []);

  const { data: reviewsData, error } = useSWR(
    isSessionReady ? `${API_URL}/api/reviews?all=true` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 60s
      errorRetryCount: 3, // Retry 3 times on failure
      errorRetryInterval: 2000, // Wait 2s between retries
    }
  );

  // Log API response for debugging
  useEffect(() => {
    console.log("API Response:", reviewsData, "Error:", error);
  }, [reviewsData, error]);

  const reviews = useMemo(() => {
    if (!reviewsData) return [];
    return reviewsData.map(item => {
      const stars = Array.from({ length: 5 }, (_, i) => {
        if (i + 1 <= Math.floor(item.rating)) return 1;
        if (i < item.rating) return 0.5;
        return 0;
      });
      return { ...item, stars };
    });
  }, [reviewsData]);

  const groupedReviewsDesktop = useMemo(() => {
    const groups = [];
    for (let i = 0; i < reviews.length; i += 3) {
      groups.push(reviews.slice(i, i + 3));
    }
    return groups;
  }, [reviews]);

  const groupedReviewsMobile = useMemo(() => {
    const groups = [];
    for (let i = 0; i < reviews.length; i += 2) {
      groups.push(reviews.slice(i, i + 2));
    }
    return groups;
  }, [reviews]);

  const swiperSettings = useMemo(
    () => ({
      modules: [Pagination, Autoplay, Lazy],
      pagination: { clickable: true },
      autoplay: { delay: 2500, disableOnInteraction: false },
      spaceBetween: 16,
      slidesPerView: 1,
      speed: 800,
      lazy: { loadPrevNext: true },
    }),
    []
  );

  if (error) {
    return <div className="text-center py-6 text-sm">Error loading reviews.</div>;
  }

  if (!reviewsData && isSessionReady) {
    return (
      <div className="container px-4 sm:px-6 w-full max-w-full">
        <h1 className="text-center pt-6 mb-6 font-[Times] text-[#2e5939] text-2xl sm:text-3xl md:text-4xl leading-[1.08] font-bold">
          Customer Reviews
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-200 animate-pulse rounded-lg w-full md:w-1/3 h-[140px] md:h-[150px] mb-4 md:mb-0"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return <div className="text-center py-6 text-sm">No Reviews found.</div>;
  }

  return (
    <div className="container px-4 sm:px-6 w-full max-w-full">
      <h1 className="text-center pt-6 mb-6 font-[Times] text-[#2e5939] text-2xl sm:text-3xl md:text-4xl leading-[1.08] font-bold">
        Customer Reviews
      </h1>

      {/* Mobile Swiper (2 stacked) */}
      <div className="md:hidden">
        <Swiper {...swiperSettings} className="w-full h-[300px]">
          {groupedReviewsMobile.map((pair, index) => (
            <SwiperSlide key={index} className="pb-5">
              <div className="flex flex-col w-full h-[290px]">
                {pair.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm flex flex-col p-4 w-full h-[140px]"
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="text-left relative flex">
                        <span className="text-green-700 mr-1">
                          <FaQuoteLeft className="size-4" />
                        </span>
                        <p className="text-sm pl-5 line-clamp-2">{item.comment}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mb-2">
                      <h3 className="text-base font-semibold text-center text-green-800 truncate">
                        {item.user?.name || "Anonymous"}
                      </h3>
                      <div className="flex justify-center space-x-1 text-yellow-400">
                        {item.stars.map((s, i) =>
                          s === 1 ? (
                            <FaStar key={i} className="size-4" aria-label="Full star" />
                          ) : s === 0.5 ? (
                            <FaStarHalfAlt key={i} className="size-4" aria-label="Half star" />
                          ) : (
                            <FaRegStar key={i} className="size-4" aria-label="Empty star" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Swiper (3 side-by-side) */}
      <div className="hidden md:block">
        <Swiper {...swiperSettings} className="w-full h-[170px]">
          {groupedReviewsDesktop.map((trio, index) => (
            <SwiperSlide key={index} className="pb-8">
              <div className="flex flex-row space-x-4 w-full h-[150px]">
                {trio.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm flex flex-col p-4 w-1/3 h-[150px]"
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="text-left relative flex">
                        <span className="text-green-700 mr-1">
                          <FaQuoteLeft className="size-5" />
                        </span>
                        <p className="text-base pl-5 line-clamp-2">{item.comment}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-2 space-y-1">
                      <h3 className="text-base font-semibold text-center text-green-800 truncate">
                        {item.user?.name || "Anonymous"}
                      </h3>
                      <div className="flex justify-center space-x-1 text-yellow-400">
                        {item.stars.map((s, i) =>
                          s === 1 ? (
                            <FaStar key={i} className="size-5" aria-label="Full star" />
                          ) : s === 0.5 ? (
                            <FaStarHalfAlt key={i} className="size-5" aria-label="Half star" />
                          ) : (
                            <FaRegStar key={i} className="size-5" aria-label="Empty star" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Reviews;