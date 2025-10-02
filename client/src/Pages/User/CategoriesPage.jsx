import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/categories`);
        setCategories(res.data); // API should return array of categories
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading Categories...</div>;
  }

  if (!categories.length) {
    return <div className="text-center py-10">No Categories Available.</div>;
  }

  return (
    <div className="py-14 px-4 md:px-8 lg:px-16 bg-white">
      <div className="text-center mb-10">
        <h1
          className="
            col-span-2 
            text-center 
            mb-3 
            font-[times]
            text-[#2e5939] 
            text-3xl 
            leading-[1.08] 
            font-bold
            capitalize
          "
        >
          All Categories
        </h1>
        <p className="text-gray-600 mt-2">
          Explore all our product categories and find what suits your needs.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/product?category=${category.name}`}
            className="group cursor-pointer"
          >
            <div className="w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full h-40 md:h-48 bg-gray-100 overflow-hidden">
                <img
                  src={category.image?.url || "/placeholder.png"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center text-gray-800 font-medium mt-2 mb-3 px-2">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
