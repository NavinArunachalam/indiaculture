import React, { useState } from "react";

const Help = () => {
  const steps = [
    "Cleanse with organic extracts to refresh your skin daily.",
    "Nourish with antioxidant-rich oils for hydration and repair.",
    "Protect with natural SPF to maintain a youthful glow."
  ];

  const skinTypes = [
    { img: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg", label: "Oily Skin" },
    { img: "https://images.pexels.com/photos/5938539/pexels-photo-5938539.jpeg", label: "Dry Skin" },
    { img: "https://images.pexels.com/photos/3762465/pexels-photo-3762465.jpeg", label: "Sensitive Skin" },
    { img: "https://images.pexels.com/photos/5938639/pexels-photo-5938639.jpeg", label: "Combination Skin" }
  ];

  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  return (
    <div className="font-poppins">

      {/* Hero Section */}
      <header className="bg-gray-100 sm:min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="font-playfair text-5xl font-semibold text-gray-800">Organic SkinCare</h1>
        <h2 className="text-2xl mt-4 text-gray-600">Glow Naturally Every Day</h2>
        <p className="mt-2 text-gray-500">Pure • Organic • Dermatologist Approved</p>
        <p className="mt-2 text-green-600">Trusted by 10,000+ Customers</p>
        <a
          href="#products"
          className="mt-4 px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Explore Products
        </a>
        <img
          src="https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg"
          alt="Skin Care Model"
          className="mt-6 rounded shadow-lg max-w-full h-auto transform transition duration-300 hover:scale-105"
        />
      </header>

      {/* Steps Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl text-green-800 font-semibold">3 Simple Steps to Radiant Skin</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {steps.map((text, index) => (
            <div key={index} className="w-64 transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-16 h-16 bg-green-800 text-white text-xl rounded-full flex items-center justify-center mx-auto">
                {index + 1}
              </div>
              <p className="mt-3 text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skin Type Section */}
      <section id="products" className="bg-green-800 text-white py-16 text-center">
        <h2 className="text-3xl font-semibold">Find the Perfect Product for Your Skin Type</h2>
        <p className="mt-3 text-white/80">
          Whether your skin is oily, dry, sensitive, or combination — we have a natural solution tailored for you.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {skinTypes.map((item, index) => (
            <div key={index} className="text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
              <img
                src={item.img}
                alt={item.label}
                className="rounded shadow-lg w-full h-48 object-cover transform transition duration-300 hover:scale-105"
              />
              <p className="mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Boxes */}
      <section className="py-16 flex flex-wrap justify-center gap-8">
        <div
          className="bg-white border-2 border-green-800 rounded-xl p-8 w-64 text-center cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
          onClick={() => setShowWhatsappModal(true)}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-14 mx-auto mb-4 transform transition duration-300 hover:scale-110" />
          <h5 className="font-semibold">Chat on WhatsApp</h5>
        </div>
        <div
          className="bg-white border-2 border-green-800 rounded-xl p-8 w-64 text-center cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
          onClick={() => setShowCallModal(true)}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/483/483947.png" alt="Call" className="w-12 mx-auto mb-4 transform transition duration-300 hover:scale-110" />
          <h5 className="font-semibold">Request a Call</h5>
        </div>
      </section>

      {/* WhatsApp Modal */}
      {showWhatsappModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowWhatsappModal(false)}
        >
          <div className="bg-white rounded-lg w-11/12 md:w-96 p-6 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={() => setShowWhatsappModal(false)}>×</button>
            <h5 className="text-lg font-semibold mb-4">Chat with Us</h5>
            <form className="space-y-3">
              <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Your Phone Number" className="w-full border border-gray-300 rounded px-3 py-2" />
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Select Skin Type</option>
                <option>Oily</option>
                <option>Dry</option>
                <option>Sensitive</option>
                <option>Combination</option>
              </select>
              <textarea placeholder="Describe your skin concern" rows={3} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCallModal(false)}
        >
          <div className="bg-white rounded-lg w-11/12 md:w-96 p-6 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={() => setShowCallModal(false)}>×</button>
            <h5 className="text-lg font-semibold mb-4">Request a Call</h5>
            <form className="space-y-3">
              <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Your Phone Number" className="w-full border border-gray-300 rounded px-3 py-2" />
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Select Skin Type</option>
                <option>Oily</option>
                <option>Dry</option>
                <option>Sensitive</option>
                <option>Combination</option>
              </select>
              <textarea placeholder="Describe your skin concern" rows={3} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 text-center">
        <h4 className="text-white text-xl mb-2">Contact Us</h4>
        <p>Email: support@organicskincare.com</p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: Green Park, New Delhi, India</p>
        <p>Working Hours: Mon - Sat (10 AM – 7 PM)</p>
        <a href="https://wa.me/918870757606" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold">
          Chat on WhatsApp
        </a>
      </footer>

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/918870757606" className="fixed bottom-5 right-5 z-50">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-16 transform transition duration-300 hover:scale-110" />
      </a>
    </div>
  );
};

export default Help;
