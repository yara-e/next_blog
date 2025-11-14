"use client";

import { login } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Register() {
    const [state, action, isPending] = useActionState(login, undefined);

    return (
        <div className="container lg:w-1/2">
            <h1 className="title">Login</h1>
            <form action={action} className="space-y-4">
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
                        <p className="error">{state.errors.password}</p>
                    )}
                </div>




                <div className="flex items-end gap-4">
                    <button disabled={isPending} className="btn-primary bg-[#008080]">
                        {isPending ? "Loading..." : "Login"}
                    </button>
                    <Link href="/register" className="text-link text-[#008080]">
                        or register here
                    </Link>
                </div>
            </form>
        </div>
    );
}
