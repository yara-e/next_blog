"use client";

import { useEffect, useState, useTransition } from "react";
import { getUserbyID } from "@/actions/auth";
import { getPosts, addLike } from "@/actions/posts";
import Link from "next/link";
import PostCard from "../../components/PostCard";

export default function Dashboard({ params }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);



    const id = params.id;

    useEffect(() => {
        async function fetchPosts() {
            const data = await getPosts(id);
            setPosts(data);
        }
        async function fetchUser() {
            const user = await getUserbyID(id);
            console.log(user.name)
            setUser(user);
        }
        fetchUser()
        fetchPosts();
    }, []);
    const handleLike = async (postId) => {
        const res = await addLike(postId);
        setPosts((prev) =>
            prev.map((p) =>
                p._id === postId ? { ...p, likes: res.likes } : p
            )
        );
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


    return (
        <main className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Profile Section */}
            {user && (
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
            )}

            {/* Posts */}
            <div className="grid grid-cols1 lg:grid-cols-2 gap-8 justify-around mt-8">
                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}



                    />
                ))}
            </div>
        </main>
    );
}
