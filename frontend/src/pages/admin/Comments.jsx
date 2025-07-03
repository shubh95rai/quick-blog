import { useEffect, useState } from "react";
import { comments_data } from "../../assets/assets";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { useAppContext } from "../../context/AppContext";

export default function Comments() {
  const { axios, loading, setLoading } = useAppContext();

  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchComments() {
    try {
      const { data } = await axios.get("/api/admin/comments");

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchComments();
      setLoading(false);
    }
    fetchData();
  }, []);

  return !loading ? (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex items-center justify-between max-w-3xl">
        <div className="flex items-center gap-4">
          <h1>Comments</h1>
          {isSubmitting && (
            <div className="size-4 animate-spin rounded-full border-2 border-t-transparent border-gray-700"></div>
          )}
        </div>
        <div className="flex gap-1 flex-col sm:flex-row">
          <button
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Approved" ? "text-primary" : "text-gray-700"
            }`}
            onClick={() => setFilter("Approved")}
          >
            Approved
          </button>
          <button
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Not Approved" ? "text-primary" : "text-gray-700"
            }`}
            onClick={() => setFilter("Not Approved")}
          >
            Not Approved
          </button>
        </div>
      </div>

      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
        {filter !== "Approved" &&
        comments.filter((comment) => comment.isApproved === false).length ===
          0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">There are no comments to approve</p>
          </div>
        ) : filter === "Approved" &&
          comments.filter((comment) => comment.isApproved === true).length ===
            0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">There are no approved comments</p>
          </div>
        ) : (
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-700 text-left uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Blog Title & Comment
                </th>
                <th scope="col" className="px-6 py-3 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {comments
                .filter((comment) => {
                  if (filter === "Approved") {
                    return comment.isApproved === true;
                  }

                  return comment.isApproved === false;
                })
                .map((comment, index) => (
                  <CommentTableItem
                    key={index}
                    comment={comment}
                    fetchComments={fetchComments}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center bg-blue-50/50">
      <div className="size-10 animate-spin rounded-full border-3 border-t-blue-50/50 border-gray-700"></div>
    </div>
  );
}
