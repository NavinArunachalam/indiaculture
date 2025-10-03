import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/reviews?all=true`, { withCredentials: true });

        // Format stars
        const formatted = res.data.data.map((item) => {
          const stars = Array.from({ length: 5 }, (_, i) => {
            if (i + 1 <= Math.floor(item.rating)) return 1;
            if (i < item.rating) return 0.5;
            return 0;
          });
          return { ...item, stars };
        });

        setReviews(formatted);
      } catch (err) {
        console.error("Failed to fetch Reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Group reviews into pairs for stacking
  const groupedReviews = [];
  for (let i = 0; i < reviews.length; i += 2) {
    groupedReviews.push(reviews.slice(i, i + 2));
  }

  if (loading) return <div className="text-center py-6 text-sm">Loading Reviews...</div>;
  if (!reviews.length) return <div className="text-center py-6 text-sm">No Reviews found.</div>;

  return (
    <div className="container px-4 sm:px-6 w-full max-w-full">
      <h1 className="text-center pt-6 mb-6 font-[Times] text-[#2e5939] text-2xl sm:text-3xl md:text-4xl leading-[1.08] font-bold">
        Customer Reviews
      </h1>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={10}
        slidesPerView={1}
        speed={800}
        className="w-full"
      >
        {groupedReviews.map((pair, index) => (
          <SwiperSlide key={index} className="pb-8">
            <div className="flex flex-col space-y-3 w-full">
              {pair.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm flex flex-col p-4 w-full min-h-[100px] sm:min-h-[140px]"
                >
                  {/* Comment Section */}
                  <div className="flex-grow">
                    <div className="text-left relative flex">
                      <span className="text-green-700 mr-1">
                        <FaQuoteLeft className="size-4 sm:size-4 md:size-5" />
                    <p className="text-sm sm:text-sm md:text-base pl-5">{item.comment}</p>
                      </span> 
                    </div>
                  </div>

                  {/* Stacked Name, Product, and Stars */}
                  <div className="text-center mt-3 space-y-1">
                    <h3 className="text-sm sm:text-sm md:text-base font-semibold text-green-800 truncate">
                      {item.user?.name || "Anonymous"}
                    </h3>

                    <div className="flex justify-center space-x-1 text-yellow-400">
                      {item.stars.map((s, i) =>
                        s === 1 ? (
                          <FaStar key={i} className="size-3 sm:size-4 md:size-5" aria-label="Full star" />
                        ) : s === 0.5 ? (
                          <FaStarHalfAlt key={i} className="size-4 sm:size-4 md:size-5" aria-label="Half star" />
                        ) : (
                          <FaRegStar key={i} className="size-4 sm:size-4 md:size-5" aria-label="Empty star" />
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
  );
};

export default Reviews;