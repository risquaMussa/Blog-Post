import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    image_url: "",
    upvotes: 0,
    comments: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error.message);
      } else {
        setPost(data);
      }
    };
    fetchPost();
  }, [id]);

  const updatePost = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("Posts").update(post).eq("id", id);
    if (!error) navigate("/");
    else console.error("Error updating post:", error.message);
  };

  const deletePost = async () => {
    const { error } = await supabase.from("Posts").delete().eq("id", id);
    if (!error) navigate("/");
    else console.error("Error deleting post:", error.message);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={updatePost} className="space-y-4">
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          placeholder="Content"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="image_url"
          value={post.image_url}
          onChange={(e) => setPost({ ...post, image_url: e.target.value })}
          placeholder="Image URL"
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={deletePost}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPage;
