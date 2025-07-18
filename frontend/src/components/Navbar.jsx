import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const { token, navigate } = useAppContext();

  return (
    <div className="flex justify-between items-center py-5 mx-6 sm:mx-20 xl:mx-32">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <button
        className="flex items-center  gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5"
        onClick={() => {
          navigate("/admin");
        }}
      >
        {token ? "Dashboard" : "Admin Login"}
        {/* <img src={assets.arrow} alt="arrow" className="w-3 mt-0.5" /> */}

        <ArrowRight className="max-sm:hidden w-4 pt-[1px]" />
      </button>
    </div>
  );
}
