import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Left Arrow
export const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-2 rounded-full shadow-md"
    >
      <FaChevronLeft className="text-lg" />
    </button>
  );
};

// Right Arrow
export const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-2 rounded-full shadow-md"
    >
      <FaChevronRight className="text-lg" />
    </button>
  );
};
