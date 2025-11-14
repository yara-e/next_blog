import getAuthUser from "@/lib/getAuthUser";
import NavLink from "./NavLink";
import { logout } from "@/actions/auth";
import { getUser } from "@/actions/auth";
import Link from "next/link";
export default async function Navigation() {
    const authUser = await getAuthUser()
    const user = await getUser()
    return (
        <nav>
            <Link href='/home' > <h1 className="text-2xl font-bold  text-gray-800 lg:block hidden">Quotly</h1></Link>

            {
                authUser ? (

                    <div className="flex items-center">
                        <NavLink label="Home" href="/" />
                        <NavLink label="Posts" href="/articles" />
                        <NavLink label="Create" href="/posts/create" />

                    </div>
                ) : (
                    <div>

                        <div className="flex items-center">
                            <NavLink label="Home" href="/" />

                            <NavLink label="Posts" href="/articles" />
                            <NavLink label="Create" href="/posts/create" />

                        </div>

                    </div>
                )
            }





            {
                authUser ? (

                    <div className="flex items-center">
                        <form action={logout}>
                            <button className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>

                            </button>
                        </form>

                        <Link href='/dashboard'> <img
                            src={user.profilePhoto || "/defulat_avtar.jpg"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"

                        /></Link>


                    </div>
                ) : (
                    <div>

                        <div className="flex items-center gap-1">
                            <Link className='bg-[#008080] rounded-full text-white h-10  py-2 text-sm font-medium min-w-[90px] flex justify-center ' href='/login'>Login</Link>
                            <Link className='border border-[#008080] rounded-full text-[#008080] h-10  py-2 text-sm font-medium min-w-[90px] flex justify-center ' href='/register'>sign up</Link>


                        </div>

                    </div>
                )
            }
        </nav >
    );
}