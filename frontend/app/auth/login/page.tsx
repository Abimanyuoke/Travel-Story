"use client"

import { BASE_API_URL } from "@/global";
import { storeCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { HiEyeSlash } from "react-icons/hi2";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import imgLogin from "../../../public/image/login.jpeg";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/login`
            const payload = JSON.stringify({ email: email, password })
            const { data } = await axios.post<{ status: boolean; message: string; token: string; data?: { id: string; name: string; role: string; profile_picture?: string } }>(url, payload, {
                headers: { "Content-Type": "application/json" }
            })
            if (data.status == true) {
                toast.success("Login success", { duration: 2000 })
                storeCookie("token", data.token)
                if (data.data) {
                    storeCookie("id", data.data.id)
                    storeCookie("name", data.data.name)
                    storeCookie("role", data.data.role)
                    storeCookie("profile_picture", data.data.profile_picture || "")
                    let role = data.data.role
                    if (role === `MANAGER`) setTimeout(() => router.replace(`/manager/dashboard`), 1000)
                    else if (role === `USER`) setTimeout(() => router.replace(`/user/home`), 1000)
                }
            }
            else toast.warning(data.message, { duration: 2000 })
        } catch (error) {
            console.log(error);
            toast.error(`Something wrong`, { duration: 2000 })
        }
    }

    return (
        <div className="bg-cyan-50 h-screen w-full">
            <div className="max-w-7xl mx-auto relative">
                <div className="absolute top-12 flex items-center gap-4">
                    <div className="relative">
                        <Image src={imgLogin} alt="Image Login" height={600} className="" />
                        <span className="absolute bg-black opacity-50 inset-0">{''}</span>
                        <div className="absolute bottom-0 text-white space-y-2">
                            <h4 className="text-2xl font-semibold">
                                Capture Your <br /> Journeys
                            </h4>
                            <p className="text-sm">Record your travel experience and memories in your personal travel journal.</p>
                        </div>
                    </div>
                    <div className="">
                        <form className="flex flex-col pt-5 gap-3" onSubmit={handleSubmit}>
                            <div className="flex w-full items-center border border-[#2E8B57] rounded relative">
                                <div className="p-3 absolute text-[#8390A2]">
                                    <MdOutlineEmail className="text-xl" />
                                </div>
                                <input type="email" placeholder="Email" className="pl-10 text-[#8390A2] border border-[#2E8B57] focus:outline-none focus:ring-[#2E8B57] rounded px-3 py-2 text-sm w-full"
                                    onChange={e => setEmail(e.target.value)} id={`email`} />
                            </div>

                            <div className="flex w-full items-center border border-[#2E8B57] rounded relative">
                                <div className="p-3 absolute text-[#8390A2]">
                                    <GiPadlock className="text-xl" />
                                </div>
                                <input type={showPassword ? `text` : `password`} className="pl-10 text-[#8390A2] border border-[#2E8B57] rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-[#2E8B57]" value={password}
                                    onChange={e => setPassword(e.target.value)} placeholder="Password" id={`password`} />
                                <div className="cursor-pointer rounded-r-md p-3 absolute right-0" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ?
                                        <IoEyeSharp className="text-[#8390A2] text-lg" /> :
                                        <HiEyeSlash className="text-[#8390A2] text-lg" />
                                    }
                                </div>
                            </div>

                            <button
                                type="submit" className="mt-3 bg-[#2E8B57] text-white py-2 rounded font-bold cursor-pointer">
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

