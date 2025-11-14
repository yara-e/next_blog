"use server";

import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { ObjectId } from "mongodb";
import { imagekit } from "@/lib/imageKit";
import { BlogPostSchema } from "@/lib/rules";
import { redirect } from "next/navigation";
import {getUser} from "./auth"
// Create post


export async function createPost(state, formData) {
    const user = await getAuthUser();
    if (!user) return redirect("/login");

    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    // ✅ Validate title & content using Zod schema
    const validated = BlogPostSchema.safeParse({ title, content });
    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            title,
            content,
        };
    }

    // ✅ Handle image upload with size validation
    let imageUrl = null;
    if (file && file.size > 0) {
        const MAX_SIZE = 1 * 1024 * 1024; // 1 MB

        if (file.size > MAX_SIZE) {
            return {
                errors: { image: ["Image size must be less than 1MB."] },
                title,
                content,
            };
        }

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${user.email}-post-${Date.now()}.jpg`,
            });
            imageUrl = uploadResponse.url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return {
                errors: { image: ["Failed to upload image. Please try again."] },
                title,
                content,
            };
        }
    }

    // ✅ Insert post into MongoDB
    const postsCollection = await getCollection("posts");
    const post = {
        title: validated.data.title,
        content: validated.data.content,
        image: imageUrl,
        userId: ObjectId.createFromHexString(user.userId),
        likes: [],
        comments: [],
        createdAt: new Date(),
    };

    await postsCollection.insertOne(post);

    // ✅ Redirect to homepage after success
    redirect("/");
}



// Get posts by user (optional)
export async function getPosts(userId = null) {
    const postsCollection = await getCollection("posts");
    const filter = userId ? { userId: ObjectId.createFromHexString(userId) } : {};

    const posts = await postsCollection
        .aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            { $sort: { createdAt: -1 } },
        ])
        .toArray();

    return posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        user: {
            id: post.user._id.toString(),
            name: post.user.name,
            email: post.user.email,
            profilePhoto: post.user.profilePhoto,
        },
        likes: post.likes || [],
        comments: post.comments || [],
    }));
}

// Like / Unlike post
export async function addLike(postId) {
    const user = await getAuthUser();
    if (!user) return redirect("/login");

    const postsCollection = await getCollection("posts");
    const post = await postsCollection.findOne({ _id: ObjectId.createFromHexString(postId) });
    if (!post) throw new Error("Post not found");

    const userObjectId = ObjectId.createFromHexString(user.userId);
    const alreadyLiked = post.likes.some((id) => id.equals(userObjectId));

    if (alreadyLiked) {
        await postsCollection.updateOne(
            { _id: ObjectId.createFromHexString(postId) },
            { $pull: { likes: userObjectId } }
        );
    } else {
        await postsCollection.updateOne(
            { _id: ObjectId.createFromHexString(postId) },
            { $push: { likes: userObjectId } }
        );
    }

    const updatedPost = await postsCollection.findOne({ _id: ObjectId.createFromHexString(postId) });

    return {
        likes: updatedPost.likes.map((id) => id.toString()),
        liked: !alreadyLiked,
    };
}

// Add comment
export async function addComment(postId, commentText) {
    const user = await getUser();
    if (!user) return redirect("/login");

    const comment = {
        userId: ObjectId.createFromHexString(user.id),
        user: {
            id: user.id,
            name: user.name,
            profilePhoto: user.profilePhoto,
        },
        comment: commentText,
        createdAt: new Date(),
    };

    const postsCollection = await getCollection("posts");
    await postsCollection.updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        { $push: { comments: comment } }
    );

    return comment;
}

// Edit post (only by owner)
export async function editPost(prevState, formData) {
    const user = await getAuthUser();
    if (!user) return redirect("/login");

    const postId = formData.get("_id");
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    const postsCollection = await getCollection("posts");
    const post = await postsCollection.findOne({
        _id: ObjectId.createFromHexString(postId),
    });

    if (!post) throw new Error("Post not found");
    if (post.userId.toString() !== user.userId) throw new Error("Not allowed");

    let imageUrl = post.image;
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `${user.email}-post-update-${Date.now()}.jpg`,
        });
        imageUrl = uploadResponse.url;
    }

    await postsCollection.updateOne(
        { _id: post._id },
        { $set: { title, content, image: imageUrl } }
    );


    redirect('/')
}

export async function deletePost(prevState, formData) {
    const user = await getAuthUser();
    if (!user) return redirect("/login");

    const postId = formData.get("_id");

    const postsCollection = await getCollection("posts");
    const post = await postsCollection.findOne({
        _id: ObjectId.createFromHexString(postId),
    });

    if (!post) throw new Error("Post not found");
    if (post.userId.toString() !== user.userId) throw new Error("Not allowed");

    await postsCollection.deleteOne({ _id: post._id });

    // ✅ After deleting, redirect to posts list
    redirect("/");
}


// Get all posts (feed)
export async function getAllPosts(page = 1, limit = 5) {
    const postsCollection = await getCollection("posts");
    const usersCollection = await getCollection("users");

    const skip = (page - 1) * limit;

    const posts = await postsCollection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    const totalPosts = await postsCollection.countDocuments();

    const postsWithUser = await Promise.all(
        posts.map(async (post) => {
            const user = await usersCollection.findOne({ _id: post.userId });
            return {
                _id: post._id.toString(),
                title: post.title,
                content: post.content,
                image: post.image || null,
                userId: post.userId.toString(),
                likes: (post.likes || []).map((id) => id.toString()),
                comments: (post.comments || []).map((c) => ({
                    ...c,
                    userId: c.userId.toString(),
                    createdAt: c.createdAt.toISOString(),
                })),
                createdAt: post.createdAt.toISOString(),
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
            };
        })
    );

    return {
        posts: postsWithUser,
        totalPages: Math.ceil(totalPosts / limit),
    };
}


export async function searchPosts(query) {
    const postsCollection = await getCollection("posts");
    const usersCollection = await getCollection("users");

    const filter = query
        ? {
            $or: [
                { title: { $regex: query, $options: "i" } },   // case-insensitive search
                { content: { $regex: query, $options: "i" } }
            ]
        }
        : {};  // if no query, return all posts

    const posts = await postsCollection.find(filter).sort({ createdAt: -1 }).toArray();

    const postsWithUser = await Promise.all(
        posts.map(async (post) => {
            const user = await usersCollection.findOne({ _id: post.userId });
            return {
                _id: post._id.toString(),
                title: post.title,
                content: post.content,
                image: post.image || null,
                userId: post.userId.toString(),
                likes: (post.likes || []).map(id => id.toString()),
                comments: (post.comments || []).map(c => ({
                    ...c,
                    userId: c.userId.toString(),
                    createdAt: c.createdAt.toISOString()
                })),
                createdAt: post.createdAt.toISOString(),
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
            };
        })
    );

    return postsWithUser;
}


export async function getPostById(id) {
    const postsCollection = await getCollection("posts");
    const usersCollection = await getCollection("users");

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) return null;

    const user = await usersCollection.findOne({ _id: post.userId });

    return {
        _id: post._id.toString(),
        title: post.title,
        content: post.content,
        image: post.image || null,
        userId: post.userId.toString(),
        likes: (post.likes || []).map((id) => id.toString()),
        comments: (post.comments || []).map((c) => ({
            ...c,
            userId: c.userId.toString(),
            createdAt: c.createdAt.toISOString(),
        })),
        createdAt: post.createdAt.toISOString(),
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
        },
    };
}
