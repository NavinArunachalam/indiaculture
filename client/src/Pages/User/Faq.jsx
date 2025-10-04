import React, { useState } from "react";
import "./Faq.css";

const FAQs = [
  {
    question: "1. How can I place an order on Indiaculture.store?",
    answer:
      'Simply browse our collection of handcrafted Indian products, select your desired items, and click on the "Add to Cart" button. Once you\'re ready, proceed to checkout by clicking the cart icon at the top right of the page. Follow the prompts to enter your shipping details and payment information to complete your purchase.',
  },
  {
    question: "2. What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit/debit cards, net banking, and UPI payments. Please choose your preferred payment option during checkout. But if you click checkout the page will redirect to Company WhatsApp, where your order details will be collected automatically from the website.",
  },
  {
    question: "3. Do you offer international shipping?",
    answer:
      "Yes, we ship our handcrafted products worldwide. International shipping charges vary based on the destination and weight of the items. You can view the estimated shipping cost at checkout before confirming your order.",
  },
  {
    question: "4. What is your return and exchange policy?",
    answer:
      "We want you to be completely satisfied with your purchase. If you're not happy with your item, please contact us within 7 days of receiving your order. We accept returns and exchanges for defective or damaged products. Please ensure the items are unused and in their original packaging.",
  },
  {
    question: "5. How can I contact customer support?",
    answer:
      "Our customer support team is here to assist you. You can reach us via email at support@indiaculture.store or call us at +91-9003689821. We're available Monday to Friday, from 9:00 AM to 6:00 PM IST.",
  },
];

const FAQSection = () => {
  // Track which FAQ is active
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <div className="faq-page">
      <h1 className="site-heading">Indiaculture</h1>
      <h1 className="site-heading">Frequently Asked Questions</h1>

      <div className="faqs-container">
        {FAQs.map((faq, idx) => (
          <div
            className={`faq ${activeIndex === idx ? "active" : ""}`}
            key={idx}
          >
            <h3 className="faq-title">{faq.question}</h3>
            <p className="faq-text">{faq.answer}</p>
            <button
              className="faq-toggle"
              onClick={() => toggleFAQ(idx)}
            >
              <i className="fas fa-chevron-down"></i>
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
