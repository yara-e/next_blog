"use client";

import { useState, useTransition, useEffect } from "react";
import { getAllPosts, searchPosts } from "@/actions/posts";
import HomePageClient from "./HomePageClient";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // 🟢 Load first page on mount
  useEffect(() => {
    const loadPosts = async () => {
      const result = await getAllPosts(1, 5);
      setData(result);
    };
    loadPosts();
  }, []);

  // 🟠 Handle search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(async () => {
      if (value.trim() === "") {
        // reset to first page
        const result = await getAllPosts(1, 5);
        setData(result);
        return;
      }

      try {
        const results = await searchPosts(value);
        setData({ posts: results, totalPages: 1 }); // search results in one page
      } catch (err) {
        console.error("Error searching posts:", err);
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full ">
      {/* 🔍 Search bar */}
      <div className="searchbar ">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
        
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-slate-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <br />
      <div className="w-full flex justify-start">
        <h2 className="text-gray-900 tracking-tight text-4xl font-bold mb-8">
          Latest Stories
        </h2>
      </div>

      {/* 🧾 Posts list */}
      <div className="w-full">
        {isPending ? (
          <p>Loading...</p>
        ) : !data ? (
          <p>Loading posts...</p>
        ) : data.posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <HomePageClient
            initialPosts={data.posts}
            totalPages={data.totalPages}
          />
        )}
      </div>
    </div>
  );
}
