import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

export default function CommentTableItem({ comment, fetchComments }) {
  const { axios } = useAppContext();

  const { blog, createdAt, _id } = comment;

  const BlogDate = new Date(createdAt).toLocaleDateString();

  async function approveComment() {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deleteComment() {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirm) return;

    try {
      const { data } = await axios.post("/api/admin/delete-comment", {
        id: _id,
      });

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name : </b> {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">{BlogDate}</td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              onClick={approveComment}
            />
          ) : (
            <p className="text-xs border border-green-600 text-green-600 bg-green-100 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            src={assets.bin_icon}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            onClick={deleteComment}
          />
        </div>
      </td>
    </tr>
  );
}
