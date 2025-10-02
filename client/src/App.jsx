import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from "./Pages/Layouts/UserLayout";
import AdminLayout from "./Pages/Layouts/AdminLayout";

// User Pages
import Home from "./Pages/User/Home";
import About from "./Pages/User/About";
import Product from "./Pages/User/Product";
import CategoriesPage from "./Pages/User/CategoriesPage";
import Profile from "./Pages/User/Profile";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/User/ProductDetail";
import Wishlist from "./Pages/User/Wishlist";
import Address from "./Pages/Cart/Address";
import EditAddress from './Pages/Cart/EditAdress';
import ReviewOrder from "./Pages/Cart/ReviewOrder";
import EmptyCart from "./Pages/Cart/EmptyCart";
import Myorders from "./Pages/User/Myorders";
import EditProfile from "./Pages/User/EditProfile";
import Faq from './Pages/User/Faq';
import Help from "./Pages/User/Help";

// Pages without Navbar/Footer
import Login from "./Pages/User/Login";
import ScrollToTop from "./Pages/User/ScrollToTop";

// Admin Pages
import Dashboard from './Pages/Admin/Dashboard';
import AdminHero from './Pages/Admin/AdminHero';
import Reel from './Pages/Admin/Reel';
import Orders from "./Pages/Admin/Orders";
import OrderDetails from "./Pages/Admin/OrderDetails";
import Customers from "./Pages/Admin/Customers";
import Categories from "./Pages/Admin/Category/Categories";
import AddCategory from "./Pages/Admin/Category/AddCategory";
import EditCategory from "./Pages/Admin/Category/EditCategory";
import EditProduct from "./Pages/Admin/Products/EditProduct";
import AddProduct from "./Pages/Admin/Products/AddProduct";
import Products from "./Pages/Admin/Products/Products";
import ManageOrders from './Pages/Admin/ManageOrders';
import AdminWishlist from "./Pages/Admin/AdminWishlist";
import Reviews from "./Pages/Admin/Reviews";
import AdminLogin from "./Pages/Admin/AdminLogin";
import UserDetails from "./Pages/Admin/UserDetails";
import OfferPage from "./Pages/User/OfferPage";
import Offer from "./Pages/Admin/Offer";

// Route Wrapper
import AdminProtected from "./Pages/Admin/AdminProtected";
import ReviewSection from './Pages/User/ReviewSection';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* --------- USER LAYOUT ROUTES --------- */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/category" element={<CategoriesPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetails/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/address" element={<Address />} />
          <Route path="/editaddress" element={<EditAddress />} />
          <Route path="/revieworder" element={<ReviewOrder />} />
          <Route path="/emptycart" element={<EmptyCart />} />
          <Route path="/myorders" element={<Myorders />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/reviews" element={<ReviewSection />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/offerspage" element={<OfferPage />} />
        </Route>

        {/* --------- ADMIN LAYOUT ROUTES --------- */}
        <Route path="/admin">
          {/* Public Admin Login */}
          <Route path="login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtected />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="categories" element={<Categories />} />
              <Route path="categories/add" element={<AddCategory />} />
              <Route path="categories/edit/:id" element={<EditCategory />} />

              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />

              <Route path="hero" element={<AdminHero />} />
              <Route path="reels" element={<Reel />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="manageorders" element={<ManageOrders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<UserDetails />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="wishlistadmin" element={<AdminWishlist />} />
              <Route path="offers" element={<Offer/>} />
            </Route>
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
