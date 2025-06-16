import { useState } from "react";
import { blog_data, blogCategories } from "../assets/assets";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";
import { LoaderCircle } from "lucide-react";

export default function BlogList() {
  const { blogs, input, loading } = useAppContext();
  const [menu, setMenu] = useState("All");

  function filteredBlogs() {
    if (input === "") {
      return blogs;
    }
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  }

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item, index) => (
          <div key={index} className="relative">
            <button
              className={`cursor-pointer text-gray-500 px-4 ${
                menu === item && "text-white"
              }`}
              onClick={() => setMenu(item)}
            >
              {item}

              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute inset-0 bg-primary -z-1 rounded-full h-6"
                />
              )}
            </button>
          </div>
        ))}
      </div>
      {!loading ? (
        blogs.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full mt-24">
            There are no blogs to show
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
            {(() => {
              const blogsToShow = filteredBlogs().filter((blog) =>
                menu === "All" ? true : blog.category === menu
              );

              return blogsToShow.length !== 0 ? (
                blogsToShow.map((blog, index) => (
                  <BlogCard key={index} blog={blog} />
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full mt-24">
                  No blogs to show for this category
                </p>
              );
            })()}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center mt-32">
          <div className="size-10 animate-spin rounded-full border-3 border-t-blue-50/50 border-gray-700"></div>
        </div>
      )}
    </div>
  );
}
