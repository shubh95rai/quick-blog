import { useEffect } from "react";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import NewsLetter from "../components/NewsLetter";
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const { fetchBlogs } = useAppContext();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsLetter />
      <Footer />
    </>
  );
}
