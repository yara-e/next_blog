"use client";

import { register } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Register() {
    const [state, action, isPending] = useActionState(register, undefined);

    return (
        <div className="container lg:w-1/2">
            <h1 className="title">Register</h1>
            <form action={action} className="space-y-4">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" defaultValue={state?.name} />
                    {state?.errors?.name && (
                        <div className="error">
                            {state.errors.name.map((err, i) => (
                                <p key={i}>{err}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" defaultValue={state?.email} />
                    {state?.errors?.email && (
                        <div className="error">
                            {state.errors.email.map((err, i) => (
                                <p key={i}>{err}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" />
                    {state?.errors?.password && (
                        <div className="error">
                            <p>Password must:</p>
                            <ul className="list-disc list-inside ml-4">
                                {state.errors.password.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input type="password" name="confirmpassword" />
                    {state?.errors?.confirmPassword && (
                        <p className="error">{state.errors.confirmPassword}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input type="file" name="profilePhoto" accept="image/*" />
                </div>

                <div className="flex items-end gap-4">
                    <button disabled={isPending} className="btn-primary bg-[#008080]">
                        {isPending ? "Loading..." : "Register"}
                    </button>
                    <Link href="/login" className="text-link text-[#008080]">
                        or login here
                    </Link>
                </div>
            </form>

        </div>
    );
}
