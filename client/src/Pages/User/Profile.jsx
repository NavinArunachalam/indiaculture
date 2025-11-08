import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProfileHeader } from "../../components/ProfileHeader";
import { QuickActions } from "../../components/QuickActions";
import { ProductSlider } from "../../components/ProductSlider";
import { AccountActions } from "../../components/AccountActions";

const API_URL = import.meta.env.VITE_API_URL;

const Index = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const confirmedRef = useRef(false); // ✅ track if confirmation already shown

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/user`, {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);

        if (!confirmedRef.current) {
          confirmedRef.current = true; // ✅ mark as confirmed
          const goToLogin = window.confirm(
            "You are not logged in. Do you want to go to the login page?"
          );

          if (goToLogin) navigate("/login");
          else navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <ProfileHeader name={profile?.name} email={profile?.email} />
          <QuickActions profile={profile} />
          <ProductSlider />
          <AccountActions />
        </div>
      </div>
    </div>
  );
};

export default Index;
