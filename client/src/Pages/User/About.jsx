import React from "react";
import { Link } from "react-router-dom";


const About = () => {
  return (
    <div className="bg-white text-gray-700 font-sans">

      {/* Header Image */}
      <img
        src="https://d3k81ch9hvuctc.cloudfront.net/company/dZdz7j/images/eafecb80-cc96-431b-804d-5f1a1d4f0966.png"
        alt="Indiaculture Header"
        className="w-full object-cover"
      />

      {/* Main Content */}
      <header className="text-center py-6">
        <h1 className="text-3xl sm:text-4xl text-yellow-700 font-serif uppercase tracking-wider">
          Welcome to INDIACULTURE
        </h1>
        <p className="font-bold text-base sm:text-lg mt-2">
          Your Destination for Natural Beauty and Wellness
        </p>
      </header>

      {/* About Text */}
      <section className="space-y-4 text-base sm:text-lg leading-6 sm:leading-7 px-4">
        <p>
          Founded on <strong>24th August 2023</strong>, Indiaculture began its journey in <em>Kuruppanaickenpalayam, Bhavani-Erode</em>, and later moved to <em>Chithode, Erode</em>, with a simple yet powerful mission: to provide affordable, high-quality, natural beauty products that promote healthy living and holistic self-care.
        </p>
        <p>
          Our flagship product, <strong>Natural Hair Oil</strong>, marked the beginning of our offline sales journey, supported by proper documentation including <strong>MSME</strong> and <strong>FSSAI</strong> registrations.
        </p>
        <p>
          For one year, we focused exclusively on offline retail, building trust with our customers through genuine products and personalized service. In our second year, we embraced the power of digital, launching our online store and sharing educational and engaging videos that quickly gained attention and allowed us to expand our product range.
        </p>
      </section>

      {/* Products */}
      <section className="mt-6 px-4">
        <h2 className="text-xl sm:text-2xl text-gray-600 uppercase mb-4 tracking-wider font-serif text-center">Our Products</h2>
        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg leading-6 sm:leading-7">
          <li>15 varieties of Organic Soaps</li>
          <li>Natural Hair Oil</li>
          <li>Herbal Shampoos</li>
          <li>2 types of Face Wash</li>
          <li>2 types of Lip Balm</li>
          <li>Sunscreen</li>
          <li>...and more coming soon!</li>
        </ul>
      </section>

      {/* Core Values */}
      <section className="mt-6 px-4">
        <h2 className="text-xl sm:text-2xl text-green-900 font-bold uppercase mb-6 tracking-wider text-center font-serif">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          {[
            { img: "https://img.icons8.com/ios-filled/80/0a3d0a/ok--v1.png", title: "Quality & Authenticity", text: "Only genuine, high-quality products from trusted brands." },
            { img: "https://img.icons8.com/ios-filled/80/0a3d0a/customer-support.png", title: "Customer First", text: "Your satisfaction and confidence are our top priorities." },
            { img: "https://img.icons8.com/ios-filled/80/0a3d0a/conference.png", title: "Diversity & Inclusion", text: "Beauty for all—celebrating every skin tone, type, and style." },
            { img: "https://img.icons8.com/ios-filled/80/0a3d0a/delivery.png", title: "Fast Delivery", text: "Quick, reliable shipping and easy service." }
          ].map((item, index) => (
            <div key={index} className="border p-4 rounded-lg flex flex-col items-center">
              <img src={item.img} alt={item.title} className="w-16 h-16 mb-2"/>
              <h4 className="text-lg font-semibold text-green-900 mb-1 font-serif">{item.title}</h4>
              <p className="text-base text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature */}
      <section className="mt-6 text-center px-4 py-6">
        <h6 className="text-2xl sm:text-3xl text-yellow-700 font-bold font-serif">NATURE INDIACULTURE</h6>
        <p className="italic text-base sm:text-lg text-green-900">Embracing Natural Beauty, Inspired by Culture</p>
      </section>

      {/* Footer Images */}
      <section className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <Link to="/login" className="w-full">
          <img
            src="https://d3k81ch9hvuctc.cloudfront.net/company/dZdz7j/images/49e55025-8a8c-441c-acd9-a96e8e42d09d.png"
            alt="Sign Up / Login"
            className="w-full"
          />
        </Link>
        <Link to="/category" className="w-full">
          <img
            src="https://d3k81ch9hvuctc.cloudfront.net/company/dZdz7j/images/ebb42a62-3905-4fac-847e-571420b47dc1.jpeg"
            alt="Go to Categories"
            className="w-full"
          />
        </Link>
      </section>

    </div>
  );
};

export default About;
