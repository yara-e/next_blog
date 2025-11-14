"use server";

import { cookies } from "next/headers";
import { getCollection } from "@/lib/db";
import { RegisterFormSchema } from "@/lib/rules";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { imagekit } from "@/lib/imageKit";
import { LoginFormSchema } from "@/lib/rules";
import { ObjectId } from "mongodb";
import { decrypt } from "@/lib/session";
export async function register(state, formData) {
    const validated = RegisterFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmpassword"),
    });

    if (!validated.success) {
        const errors = {};
        validated.error.issues.forEach((issue) => {
            const field = issue.path[0] || "_";
            if (!errors[field]) errors[field] = [];
            errors[field].push(issue.message);
        });

        return { errors, email: formData.get("email") };
    }

    const { name, email, password } = validated.data;

    const userCollection = await getCollection("users");
    if (!userCollection) return { errors: { email: ["Server error"] } };

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
        return { errors: { email: ["Email already exists"] } };
    }


    const file = formData.get("profilePhoto");
    let imageUrl = null;

    if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `${email}-profile.jpg`,
        });

        imageUrl = uploadResponse.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        profilePhoto: imageUrl, // ✅ save photo URL
    });

    await createSession(result.insertedId.toString());

    redirect("/dashboard");
}


export async function login(state, formData) {
    const validatedFileds = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })
    if (!validatedFileds.success) {
        const errors = {};
        validatedFileds.error.issues.forEach(issue => {
            const field = issue.path[0] || "_";
            if (!errors[field]) {
                errors[field] = [];
            }
            errors[field].push(issue.message);
        });

        return {
            errors,
            email: formData.get("email"),
        };
    }
    const { email, password } = validatedFileds.data;

    const userCollection = await getCollection("users")
    if (!userCollection) {
        return { errors: { email: "Server error!" } }
    }
    const existingUser = await userCollection.findOne({ email })
    if (!existingUser) return { errors: { email: ["Invalid credentials."] } }

    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (!matchedPassword) return { errors: { email: ["Invalid credentials."] } }

    await createSession(existingUser._id.toString())
    console.log(existingUser)
    redirect('/dashboard')
}


export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    redirect('/')
}



export async function getUser() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (session) {
        const usercookie = await decrypt(session)

        const userCollection = await getCollection("users");
        const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(usercookie.userId), });
        console.log(user)
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
        }
    }

}

export async function getUserbyID(userid) {

    const userCollection = await getCollection("users");
    const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(userid), });
    console.log(user)
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
    }

}
