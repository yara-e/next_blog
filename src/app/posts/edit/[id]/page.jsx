import { editPost } from "@/actions/posts";
import BlogForm from "@/app/components/BlogForm";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function EditPage({ params }) {
    const postsCollection = await getCollection("posts");
    const post = await postsCollection.findOne({
        _id: ObjectId.createFromHexString(params.id),
    });

    if (!post) {
        return <p>Post not found</p>;
    }

    // ✅ Extract only safe plain fields (no spreading post)
    const safePost = {
        _id: post._id.toString(),
        title: post.title ?? "",
        content: post.content ?? "",
        image: post.image ?? "",
    };
    console.log("safePost:", JSON.stringify(safePost, null, 2));
    return (
        <div>
            <h1>Edit Post</h1>
            <BlogForm handler={editPost} initialData={safePost} />
        </div>
    );
}
