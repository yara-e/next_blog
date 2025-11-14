// components/PostCard.js
"Use client"
import { useState } from "react";
import Link from "next/link";

export default function PostCard({ post, onLike, onComment, onDelete, isOwner = false }) {
    // Create preview of content
    const preview =
        post.content.length > 15
            ? post.content.slice(0, 15) + "..."
            : post.content;

              const [showComments, setShowComments] = useState(false);
    return (
        <div className="bg-white rounded-2xl overflow-hidden group flex flex-col shadow-sm border border-gray-200">
             

            {/* Post Content */}
            
            {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 bg-center bg-cover"
                />
            )}
           
<div class="p-6 flex flex-col flex-grow">
<div className="flex justify-between align-center">
<h2 className="text-gray-800 text-lg font-bold leading-tight  ">{post.title}</h2>
{isOwner && (
                <div className="flex gap-2 mt-3">
                    <button >
                        <Link href={`/posts/edit/${post._id.toString()}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"  />
</svg>
</Link>
                    </button>
                    <button
                        onClick={() => onDelete(post._id)}
                         className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

                    </button>
                </div>
            )}
</div>
 <Link href={`/users/${post.user.id}`}>
                
                        <span className="text-xs text-gray-400 mt-0">by {post.user.name}</span>&nbsp;
                          <span className="text-xs text-gray-400">
                <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toISOString().split("T")[0]}
                </time>


            </span>
                       
                    
                
            </Link>
            <br/>
 <p className="text-gray-700 mb-2">{preview}</p>
            {/* Read More */}
           

            

           
             

            {/* Actions */}
            <div className="flex gap-4 mt-3 items-center">
                <button
                    onClick={() => onLike(post._id)}
                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
 {post.likes.length}
                </button>

                
                    <button  className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                    onClick={() => setShowComments(!showComments)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>
  {post.comments.length}
                    </button>
                   
                  
                <Link
                    href={`/posts/show/${post._id}`}
                    className=" flex items-center justify-center gap-2 rounded-full h-8  px-6 bg-[#008080] text-white text-base font-bold transition-transform hover:scale-105"
                >
                    Read More 
                </Link>
            
            </div>

{showComments && (
<div>
     <ul className="mt-2 space-y-1">
                        {post.comments.map((c, i) => (
                            <li key={i} className=" flex gap-1 items-center text-sm text-gray-700">
                                <span> <img src={c.user.profilePhoto || "/defulat_avtar.jpg"}
                                          
                                 className="flex w-8 h-8 rounded-full object-cover " />
                </span>
                                <span className="font-semibold">{c.user?.name}: </span>
                                {c.comment}
                            </li>
                        ))}
                    </ul>
                    {onComment && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const text = e.target.comment.value;
                                if (text.trim()) {
                                    onComment(post._id, text);
                                    e.target.reset();
                                }
                            }}
                            className="mt-2 flex gap-2"
                        >
                            <input
                                type="text"
                                name="comment"
                                placeholder="Write a comment..."
                                className=" rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-full h-8  px-6 bg-[#008080] text-white text-base font-bold transition-transform hover:scale-105"
                            >
                                Post
                            </button>
                        </form>
                    )}
                
</div> )}

            </div>
        </div>
    );
}
