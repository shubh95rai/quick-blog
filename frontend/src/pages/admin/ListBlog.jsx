import { useEffect, useState } from "react";
import { blog_data } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

export default function ListBlog() {
  const { axios, loading, setLoading } = useAppContext();

  const [blogs, setBlogs] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchBlogs() {
    try {
      const { data } = await axios.get("/api/admin/blogs");

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchBlogs();
      setLoading(false);
    }
    fetchData();
  }, []);

  return !loading ? (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex items-center gap-4">
        <h1>All Blogs</h1>
        {isSubmitting && (
          <div className="size-4 animate-spin rounded-full border-2 border-t-transparent border-gray-700"></div>
        )}
      </div>

      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th
                scope="col"
                className="px-2 py-4 xl:px-6
                    "
              >
                #
              </th>
              <th scope="col" className="px-2 py-4">
                Blog Title
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="">
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={index}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
                setIsSubmitting={setIsSubmitting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center bg-blue-50/50">
      <div className="size-10 animate-spin rounded-full border-3 border-t-blue-50/50 border-gray-700"></div>
    </div>
  );
}
