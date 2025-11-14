// app/posts/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById, addLike, addComment } from "@/actions/posts";
import Link from "next/link";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            const data = await getPostById(id);
            setPost(data);
        }
        fetchPost();
    }, [id]);

    const handleLike = async (postId) => {
        const res = await addLike(postId);
        setPost((prev) => ({ ...prev, likes: res.likes }));
    };

    const handleComment = async (postId, text) => {
        const newComment = await addComment(postId, text);
        setPost((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment],
        }));
    };

    if (!post) {
        return <p className="text-center py-10">Loading...</p>;
    }

    return (
        <div className="flex flex-col w-full mx-auto items-center justify-center  lg:w-1/2">
            
              {/* Post Content */}
              <div className="w-full flex justify-start">
            <h2 className="text-black tracking-tight text-4xl md:text-5xl font-bold leading-tight font-display text-left pb-4">{post.title}</h2>
            </div>


            <div class="w-full flex justify-start border-b border-gray-300 my-2">
 <Link  href={`/users/${post.user.id}`}>
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src={post.user.profilePhoto || "/defulat_avtar.jpg"}
                         
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{post.user.name}</p>
                        <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
            </p>
                    </div>
                </div>
            </Link>

            </div>
           
           

          
            {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-1/2 object-cover rounded my-2"
                />
            )}


            <p className="prose prose-lg max-w-none text-gray-800 px-4 font-display text-lg leading-relaxed ">{post.content}</p>




            {/* Timestamp */}
           



            {/* Actions */}
            <div className="flex gap-4 mt-3 border-b border-gray-300 my-2 w-full">
                <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
 {post.likes.length}
                </button>
                
            </div> 
            
            <div className='flex flex-col gap-4 mt-3 my-2 w-full'>
Comments ({post.comments.length})

<form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const text = e.target.comment.value;
                            if (text.trim()) {
                                handleComment(post._id, text);
                                e.target.reset();
                            }
                        }}
                        className="mt-2 flex flex-col gap-2"
                    >
                         <input
                                type="text"
                                name="comment"
                                placeholder="Write a comment..."
                                className=" rounded px-2 py-4 flex-1 text-sm focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-full h-8 w-1/4  px-6 bg-[#008080] text-white text-base font-bold transition-transform hover:scale-105"
                            >
                                Post
                            </button>
                    </form>
 <ul className="mt-2 space-y-1">
                        {post.comments.map((c, i) => (
                             <li key={i} className=" flex  gap-1  text-sm text-gray-700">
                                <div className="flex gap-1"> <img src={c.user.profilePhoto || "/defulat_avtar.jpg"}
                                          
                                 className="flex w-8 h-8 rounded-full object-cover " />
                                   
                </div>
                               
                              <div className="flex flex-col gap-2">  
<span className="font-bold text-black">{c.user?.name} </span> 
                                {c.comment}
                                </div>  
                            </li>
                        ))}
                    </ul>

                    


            </div>

        </div>
    );
}
