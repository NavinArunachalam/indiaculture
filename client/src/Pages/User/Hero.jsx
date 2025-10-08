import React, { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../../components/ui/Arrow";

const API_URL = import.meta.env.VITE_API_URL;

const transformImageUrl = (url, width) =>
  url.replace("/upload/", `/upload/w_${width},q_auto,f_webp/`);

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hero`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const data = response.data
          .map(hero => ({
            productId: hero.product?._id,
            productName: hero.product?.name || "Hero Slide",
            image: transformImageUrl(hero.images?.[0]?.url, 800),
          }))
          .filter(slide => slide.image); // Only require image
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = slides[0].image;
      document.head.appendChild(link);
    }
  }, [slides]);

  const settings = useMemo(
    () => ({
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
      lazyLoad: "ondemand",
    }),
    []
  );

  if (isLoading) {
    return (
      <section className="w-full h-[200px] sm:h-[200px] md:h-[400px] lg:h-[410px] bg-gray-200 animate-pulse rounded-lg"></section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="w-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="outline-none w-full flex flex-col items-center">
            <Link to={`/productdetails/${slide.productId}`} className="w-full">
              <img
                src={slide.image}
                alt={slide.productName}
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
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
