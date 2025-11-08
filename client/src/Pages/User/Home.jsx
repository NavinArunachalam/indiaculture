import React from "react";
import Hero from "./Hero";
import Category from "./Category";
import BestSellingProduct from "./BestSellingProduct";
import HairCare from "./HairCare"
import ReviewList from "./ReviewList";
import Reels from "./Reels";
import SkinCare from "./SkinCare"

const Home = () => {
  return (
    <>
<div className="p-0 m-0">
      <Hero />
      <Category />
      <Reels />
      <HairCare />
      <SkinCare />
      <BestSellingProduct />
      <ReviewList />
      </div>
    </>

  );
};

export default Home;
