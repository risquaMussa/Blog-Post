import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState("newest");

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from("Posts").select("*");

      if (sortBy === "upvotes") {
        query = query.order("upvotes", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error) setPosts(data);
      else console.error("Error fetching posts:", error.message);
    };

    fetchPosts();
  }, [location.search, sortBy]);

  const handleUpvote = async (postId, currentUpvotes) => {
    const { error } = await supabase
      .from("Posts")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", postId);
    if (error) {
      console.error("Error upvoting post:", error.message);
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    }
  };

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Places to Visit in Washington, DC!
      </h1>
      {/* Slider for top 3 posts with images  by using swiper*/}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-xl overflow-hidden mb-10"
      >
        {posts
          .filter((post) => post.image_url)
          .slice(0, 3)
          .map((post) => (
            <SwiperSlide key={post.id}>
              <div className="relative w-full h-64 sm:h-80">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <p className="text-sm">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* //sorted */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() =>
            setSortBy((prev) => (prev === "newest" ? "upvotes" : "newest"))
          }
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Sort by: {sortBy === "newest" ? "Most Upvoted" : "Newest"}
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Posts</h2>
      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition duration-300 overflow-hidden flex flex-col justify-between h-[500px]"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  // onChange={handleChange}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-blue-600 text-center">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Posted{" "}
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3 text-center">
                  {post.content}
                </p>
                <p className="text-sm text-gray-500 mt-auto text-center">
                  Upvotes: {post.upvotes}
                  <button
                    onClick={() => handleUpvote(post.id, post.upvotes)}
                    className="ml-2 bg-white-600 text-white px-2 py-1 rounded hover:bg-white-700 transition duration-200"
                  >
                    👍
                  </button>
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
