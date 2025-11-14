"use client";

import { useEffect, useState, useTransition } from "react";
import { getUser } from "@/actions/auth";
import { getAllPosts, addLike, deletePost, getPosts } from "@/actions/posts";
import Link from "next/link";
import PostCard from "../components/PostCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchData() {
      const u = await getUser();

      if (!u) return;
      setUser(u);

      const p = await getPosts(u.id);

      setPosts(p);
    }
    fetchData();
  }, []);

  if (!user) {
    return <p className="text-center mt-10">You must be logged in.</p>;
  }

  const handleLike = async (postId) => {
    try {
      const res = await addLike(postId); // returns { likes: [...] }
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: res.likes }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };


  const handleComment = async (postId, text) => {
    const newComment = await addComment(postId, text);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };
  const handleDelete = (postId) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("_id", postId);

      try {
        await deletePost(null, formData); // call server action
        setPosts((prev) => prev.filter((p) => p._id !== postId)); // update UI
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    });
  };

  return (
    <div className="flex flex-col justify-start w-full  ">
      {/* Profile Section */}
      <div className="flex items-center gap-6  rounded-lg p-6  ">
        {user.profilePhoto && (
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8 ">
<h2 className="text-2xl font-bold tracking-tight text-gray-900">My Posts</h2>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-around mt-8">
        {posts.map((post) => (
          <PostCard
            key={String(post._id)}
            post={post}
            onLike={handleLike}
            onComment={handleComment}

            onDelete={handleDelete}
            isOwner={true}
          />
        ))}

        </div>
      </div>
    </div>
  );
}
