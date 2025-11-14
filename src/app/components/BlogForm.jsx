"use client";

import { useActionState } from "react";
import { useState, useEffect } from "react";

export default function BlogForm({ handler, initialData }) {
    useEffect(() => {
        console.log("BlogForm initialData:", initialData);
    }, [initialData]);

    const [state, action, isPending] = useActionState(handler, undefined);
    const [preview, setPreview] = useState(initialData?.image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    return (
        <form action={action} className="space-y-4 max-w-xl mx-auto p-4 border rounded-md bg-white shadow-sm">
            {/* Hidden ID */}
            <input type="hidden" name="_id" value={initialData?._id} />

            {/* Title */}
            <div>
                <label htmlFor="title" className="block font-medium mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={state?.title ?? initialData?.title}
                    className="border w-full px-3 py-2 rounded-md"
                />
                {state?.errors?.title && (
                    <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>
                )}
            </div>

            {/* Content */}
            <div>
                <label htmlFor="content" className="block font-medium mb-1">Content</label>
                <textarea
                    name="content"
                    rows="6"
                    defaultValue={state?.content ?? initialData?.content}
                    className="border w-full px-3 py-2 rounded-md"
                ></textarea>
                {state?.errors?.content && (
                    <p className="text-red-600 text-sm mt-1">{state.errors.content}</p>
                )}
            </div>

            {/* Image upload */}
            <div>
                <label htmlFor="image" className="block font-medium mb-1">Post Image</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                />
                {state?.errors?.image && (
                    <p className="text-red-600 text-sm mt-1">{state.errors.image}</p>
                )}
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 w-48 h-48 object-cover rounded-md"
                    />
                )}
            </div>

            {/* Submit button */}
            <button
                disabled={isPending}
                className="bg-[#008080]  text-white py-2 px-4 rounded w-full"
            >
                {isPending ? "Loading..." : "Submit"}
            </button>

            {/* General error block */}
            {state?.errors && !state.errors.title && !state.errors.content && !state.errors.image && (
                <p className="text-red-600 text-sm mt-2 text-center">
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    );
}
