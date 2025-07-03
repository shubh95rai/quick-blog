import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

export default function BlogTableItem({
  blog,
  fetchBlogs,
  index,
  isSubmitting,
  setIsSubmitting,
}) {
  const { axios } = useAppContext();

  const { title, createdAt } = blog;

  const BlogDate = new Date(createdAt).toDateString();

  async function deleteBlog() {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirm) return;

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/blog/delete", {
        id: blog._id,
      });

      if (data.success) {
        await fetchBlogs();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function togglePublish() {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      if (data.success) {
        await fetchBlogs();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 text-xs flex gap-3 flex-col sm:flex-row items-center">
        <button
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
          onClick={togglePublish}
          disabled={isSubmitting}
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={deleteBlog}
          disabled={isSubmitting}
          className="shrink-0 sm:pr-4"
        >
          <img
            src={assets.cross_icon}
            alt=""
            className="w-8 hover:scale-110 transition-all cursor-pointer"
          />
        </button>
      </td>
    </tr>
  );
}
