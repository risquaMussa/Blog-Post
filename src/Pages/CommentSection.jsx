import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("Posts")
      .select("comments")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      try {
        const parsedComments = JSON.parse(data?.comments || "[]");
        setComments(parsedComments);
      } catch (e) {
        console.error("Error parsing comments:", e);
        setComments([]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("Posts")
      .select("comments")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      setLoading(false);
      return;
    }

    let existingComments = [];
    try {
      existingComments = JSON.parse(data?.comments || "[]");
    } catch (e) {
      console.error("Error parsing existing comments:", e);
    }

    const newEntry = {
      id: Date.now(), // simple unique ID
      content: newComment,
      created_at: new Date().toISOString(),
    };

    const updatedComments = [newEntry, ...existingComments];

    const { error: updateError } = await supabase
      .from("Posts")
      .update({ comments: JSON.stringify(updatedComments) })
      .eq("id", postId);

    if (updateError) {
      console.error("Insert error:", updateError);
    } else {
      setNewComment("");
      await fetchComments();
    }

    setLoading(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditComment(comments[index].content);
  };

  const handleSaveEdit = async (index) => {
    const updated = [...comments];
    updated[index].content = editComment;
    updated[index].edited_at = new Date().toISOString();

    const { error } = await supabase
      .from("Posts")
      .update({ comments: JSON.stringify(updated) })
      .eq("id", postId);
    if (error) {
      console.error("Error updating comment:", error);
    }
    setComments(updated);
    setEditingIndex(null);
    setEditComment("");
  };

  const handleDelete = async (index) => {
    const updated = comments.filter((_, i) => i !== index);
    const { error } = await supabase
      .from("Posts")
      .update({ comments: JSON.stringify(updated) })
      .eq("id", postId);
    if (error) {
      console.error("Error deleting comment:", error);
    }
    setComments(updated);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Comments</h3>

      <div className="space-y-3 mb-6">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 rounded shadow-sm relative"
            >
              <div className="absolute top-2 right-2 flex gap-2 text-gray-500">
                <FiEdit2
                  className="cursor-pointer hover:text-blue-600"
                  size={14}
                  onClick={() => handleEdit(index)}
                />
                <FiTrash2
                  className="cursor-pointer hover:text-red-600"
                  size={14}
                  onClick={() => handleDelete(index)}
                />
              </div>

              {editingIndex === index ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="flex-grow px-2 py-1 border border-gray-300 rounded"
                  />
                  <button
                    className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleSaveEdit(index)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {/* for display hours ago instead of displaying date  */}
                    {comment.created_at
                      ? `Posted ${formatDistanceToNow(
                          new Date(comment.created_at),
                          { addSuffix: true }
                        )}`
                      : ""}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded text-white transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Posting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
export default CommentSection;
