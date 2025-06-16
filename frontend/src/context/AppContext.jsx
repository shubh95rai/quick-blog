import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export function AppProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/blog/all");

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // fetchBlogs();

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          // handle token expiration
          localStorage.removeItem("token");
          setToken(null);
          axios.defaults.headers.common["Authorization"] = null;
        } else {
          setToken(token);
          axios.defaults.headers.common["Authorization"] = token;
        }
      } catch (error) {
        console.error(`Invalid token: ${error}`);
        localStorage.removeItem("token");
        setToken(null);
        axios.defaults.headers.common["Authorization"] = null;
      }
    }
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs,
    loading,
    setLoading
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
