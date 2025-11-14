// app/home/HomePageClient.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { getAllPosts, addLike, addComment } from "@/actions/posts";
import PostCard from "../components/PostCard";

export default function HomePageClient({ initialPosts, totalPages }) {
    const [posts, setPosts] = useState(initialPosts || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);
    const pathname = usePathname(); // 👈 detect when route changes




    useEffect(() => {
  console.log("totalPages:", totalPages);
}, [totalPages]);
    // 🔄 Reset scroll + posts when route changes (important for /home)
    useEffect(() => {
        setPage(1);
        setPosts(initialPosts || []);
        window.scrollTo(0, 0);
    }, [pathname]);

    // 🧭 Fetch next pages
    useEffect(() => {
        if (page === 1) return; // already loaded server-side

        let ignore = false;
        async function fetchPosts() {
            if (loading) return;
            setLoading(true);
            try {
                const data = await getAllPosts(page, 5);

                if (!ignore) {
                    setPosts((prev) => {
                        const seen = new Set(prev.map((p) => String(p._id)));
                        const newPosts = data.posts.filter((p) => !seen.has(String(p._id)));
                        return [...prev, ...newPosts];
                    });
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
        return () => { ignore = true };
    }, [page]);

    // 👀 Infinite scroll observer
    useEffect(() => {
  if (!loaderRef.current) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const first = entries[0];
      if (first.isIntersecting && !loading && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    },
    { threshold: 0.1 }
  );

  const current = loaderRef.current;
  observer.observe(current);
  return () => observer.unobserve(current);
}, [loading, totalPages]);


    // ❤️ Like handler
    const handleLike = async (postId) => {
        try {
            const res = await addLike(postId);
            setPosts((prev) =>
                prev.map((p) =>
                    String(p._id) === String(postId) ? { ...p, likes: res.likes } : p
                )
            );
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    // 💬 Comment handler
    const handleComment = async (postId, text) => {
        try {
            const newComment = await addComment(postId, text);
            setPosts((prev) =>
                prev.map((p) =>
                    String(p._id) === String(postId)
                        ? { ...p, comments: [...p.comments, newComment] }
                        : p
                )
            );
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    return (
        <div  className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-around">
            {posts.map((post) => (
                <PostCard
                    key={String(post._id)}
                    post={{ ...post, _id: String(post._id) }}
                    onLike={handleLike}
                    onComment={handleComment}
                />
            ))}

            {/* Loader sentinel */}
            {page < totalPages && (
                <div ref={loaderRef} className="text-center py-10 mt-10 text-gray-500">
  {loading ? "Loading more..." : "Scroll to load more"}
</div>
            )}
        </div>
    );
}
