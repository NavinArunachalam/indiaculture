import { User, Home, Star, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AccountActionItem = ({ icon, label, onClick }) => {
  return (
    <div
      className="p-5 cursor-pointer bg-white rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:-translate-x-2 hover:shadow-xl border border-gray-300"
      style={{
        background: "linear-gradient(to right, #ffffff, #f9fafb)",
        transformOrigin: "center",
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-2 rounded-full text-green-600 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300"
          style={{
            backgroundColor: "#ecfdf5",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {icon}
        </div>
        <span
          className="font-semibold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-300"
          style={{ transition: "color 0.3s ease-in-out" }}
        >
          {label}
        </span>
      </div>
      <div
        className="text-gray-500 group-hover:text-green-600 transition-colors duration-300"
        style={{
          transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
          transform: "rotate(0deg)",
        }}
      >
        →
      </div>
    </div>
  );
};

export const AccountActions = () => {
  const navigate = useNavigate();

  const handleAddress = () => {
    // Pass currentUser via state
    navigate("/editaddress");
  };
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div
        className="p-8 rounded-2xl shadow-lg"
        style={{
          background: "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
        }}
      >
        <h2
          className="text-xl font-bold text-gray-900 mb-8 border-b-2 pb-3"
          style={{ borderColor: "#d1fae5" }}
        >
          Account & Orders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Edit Profile */}
          <Link to="/editprofile">
            <AccountActionItem
              icon={<User size={22} />}
              label="Edit Profile"
            />
          </Link>

          {/* Edit Address */}

          <AccountActionItem
            icon={<Home size={22} />}
            label="Edit Address"
            onClick={handleAddress}
          />

          {/* Add Reviews → Navigate to Review page */}
          <Link to="/reviews">
            <AccountActionItem
              icon={<Star size={22} />}
              label="Add Reviews"
            />
          </Link>

          {/* FAQs */}
          <Link to="/faq">
            <AccountActionItem
              icon={<MessageCircleQuestion size={22} />}
              label="FAQs for Orders"
            /></Link>
        </div>
      </div>
    </div>
  );
};
