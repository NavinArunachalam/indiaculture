import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../../components/ui/Arrow";

const API_URL = import.meta.env.VITE_API_URL;

const Hero = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hero`);
        const data = response.data
          .map(hero => ({
            productId: hero.product?._id,
            productName: hero.product?.name,
            image: hero.images?.[0]?.url
          }))
          .filter(slide => slide.image && slide.productId); // only valid ones
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (slides.length === 0) return null;

  return (
    <section className="w-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="outline-none w-full flex flex-col items-center">
            {/* ✅ Clickable image */}
            <Link to={`/productdetails/${slide.productId}`} className="w-full">
              <img
                src={slide.image}
                alt={slide.productName}
                className="w-full h-[200px] sm:h-[200px] md:h-[400px] lg:h-[410px] object-cover rounded-lg"
              />
            </Link>
      
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
