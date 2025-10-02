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

  if (loading) return <div className="text-center py-10">Loading Reviews...</div>;
  if (!reviews.length) return <div className="text-center py-10">No Reviews found.</div>;

  return (
    <div className="container px-4 sm:px-6">
      <h1 className="text-center pt-10 mb-10 font-[Times] text-[#2e5939] text-3xl md:text-4xl leading-[1.08] font-bold">
        Customer Reviews
      </h1>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          1000: { slidesPerView: 3 },
        }}
        speed={800}
      >
        {reviews.map((item, index) => (
          <SwiperSlide key={index} className="pb-12 text-green-900">
            <div className="bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm min-h-[160px] md:min-h-[160px] flex flex-col p-6">
              {/* Comment Section */}
              <div className="flex-grow md:flex-grow-0">
                <div className="text-left relative flex">
                  <span className="text-green-700 mr-2">
                    <FaQuoteLeft className="size-3 sm:size-4 md:size-5" />
                  </span> <br/>
                </div>
                 <p className="text-sm sm:text-sm md:text-base ">
                    {item.comment}
                  </p>
              </div>

              {/* Stacked Name, Product, and Stars */}
              <div className=" text-center mt-4 space-y-2">
                <h3 className="text-sm md:text-base font-semibold text-green-800 truncate">
                  {item.user?.name || "Anonymous"}
                </h3>

                <div className="flex justify-center space-x-1 text-yellow-400">
                  {item.stars.map((s, i) =>
                    s === 1 ? (
                      <FaStar key={i} className="size-4 md:size-5" aria-label="Full star" />
                    ) : s === 0.5 ? (
                      <FaStarHalfAlt key={i} className="size-4 md:size-5" aria-label="Half star" />
                    ) : (
                      <FaRegStar key={i} className="size-4 md:size-5" aria-label="Empty star" />
                    )
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;