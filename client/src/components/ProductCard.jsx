export const ProductCard = ({ image, title, price, originalPrice, discount }) => {
  return (
    <div className="p-4 rounded-xl shadow-sm bg-white hover:shadow-md hover:-translate-y-1 transition-transform duration-300">
      <div className="aspect-square overflow-hidden rounded-lg mb-3">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
        {title}
      </h3>
      <div className="flex items-center gap-2 text-sm">
        <span className="line-through text-gray-400">₹{originalPrice}</span>
        <span className="font-bold text-gray-800">₹{price}</span>
        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs font-medium">
          {discount}% OFF
        </span>
      </div>
    </div>
  );
};
