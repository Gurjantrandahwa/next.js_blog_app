import React from "react";
import Link from "next/link";


export default function Header() {
    return <header className={"flex justify-between p-5 max-w-7xl mx-auto"}>
        <div className={"flex items-center space-x-5"}>
            <Link href={"/"}>
                <p className={"text-2xl font-bold cursor-pointer"}>Blog app</p>

            </Link>
            <div className={"hidden md:inline-flex items-center space-x-5 "}>
                <h3>About</h3>
                <h3>Contact</h3>
                <h3 className={"text-white bg-green-600 px-4 py-1 rounded-full"}>Follow</h3>
            </div>
        </div>
        <div className={"flex items-center space-x-5 text-green-600"}>
            <h3>Sign In</h3>
            <h3 className={"border border-green-600 rounded-full py-1 px-4"}>Get Started</h3>
        </div>
    </header>
}