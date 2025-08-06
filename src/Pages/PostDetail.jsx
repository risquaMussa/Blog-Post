import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id)
        .single(); // Fetch a single post by ID
      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data); // data is a single post object
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("Posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error.message);
      return;
    }
    toast.success("Post deleted successfully!");

    setTimeout(() => {
      navigate("/"); // Redirect to home after deletion
    }, 1500);
    // Update the posts state to remove the deleted post
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("Posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", post.id)
      .select()
      .single();

    if (error) {
      console.error("Error upvoting post:", error.message);
      return;
    }

    setPost(data);
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        PostDetail
      </h1>
      {post ? (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 object-cover mb-4 rounded"
          />
          <p className="text-gray-700 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500">Upvotes: {post.upvotes}</p>
          <button
            onClick={handleUpvote}
            className="ml-2 bg-white-600 text-white px-2 py-1 rounded hover:bg-white-700 transition duration-200"
          >
            👍
          </button>
          <span>
            {" "}
            <p></p>
            <div className="flex gap-x-[2px]">
              <button
                onClick={() => navigate(`/edit/${post.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
            <CommentSection postId={post.id} />
          </span>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading post...</p>
      )}
    </div>
  );
};

export default PostDetail;
