import React, { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    image_url: "",
    upvotes: 0,
    comments: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: name === "upvotes" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await supabase.from("Posts").insert([post]);

    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      navigate("/"); // Redirect to home after successful post creation has to be go to home page
    }
  };

  return (
    <div
      style={{ marginTop: "80px", borderRadius: "10px" }}
      className="max-w-xl mx-auto p-25 bg-white shadow rounded mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            name="image_url"
            value={post.image_url}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comments (optional)
          </label>
          <input
            type="text"
            name="comments"
            value={post.comments}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upvotes (optional)
          </label>
          <input
            type="number"
            name="upvotes"
            value={post.upvotes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
