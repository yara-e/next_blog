// app/page.jsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full  overflow-hidden">
     
      <div className="flex flex-col items-center justify-center text-center w-full h-screen px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-5xl font-bold tracking-tighter text-gray-800 sm:text-6xl md:text-7xl">
            Welcome to Quotly
          </h2>
          <p className="max-w-xl text-lg text-gray-600">
            Discover stories, thinking, and expertise from writers on any topic
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-4 mt-8">
          <Link
            href="/articles"
            className="group flex flex-1 items-center justify-center gap-2 rounded-full h-12 px-6 bg-[#008080] text-white text-base font-bold transition-transform hover:scale-105"
          >
            Start reading
          </Link>

          <Link
            href="/posts/create"
            className="flex flex-1 items-center justify-center rounded-full h-12 px-6 border border-[#008080] bg-transparent text-[#008080] text-base font-bold transition-colors hover:bg-[#008080] hover:text-white"
          >
            Start writing
          </Link>
        </div>
      </div>
    </div>
  );
}
