import BlogForm from "@/app/components/BlogForm";
import { createPost } from "@/actions/posts";
export default async function create() {
    return (
        <div className="container lg:w-1/2">
            <h1 className="title">Create a new post</h1>
            <BlogForm handler={createPost}></BlogForm>

        </div>
    )

}