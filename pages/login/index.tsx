import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { URLParameterBuilder } from "../../helpers";

const Login: NextPage = () => {

    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                Accept: 'application/json'
            },
            credentials: 'include',
            body: URLParameterBuilder({
                username: username,
                password: password
            })
        })

        const data = await response.json()

        if (response.status != 200) {
            return console.log('Response: ', response.body);
        }

        console.log('Response: ', data, response.status);
        // console.log('HELLO WORLD');
        
        router.push("/")

    }

    return (
        <>
            <div className="h-full w-full flex justify-center items-center font-nunito">
                <form className="md:w-full md:max-w-lg mx-4 border rounded p-4" onSubmit={onSubmit}>
                    <h1 className="text-center text-xl text-slate-800 font-semibold">Welcome</h1>
                    <h2 className="text-center text-lg text-slate-400">Make sure that you have right access</h2>
                    <div className="mt-6">
                        <label className="text-lg block">Username</label>
                        <div className="mt-1">
                            <input className="text-lg p-2 border rounded w-full placeholder:text-slate-400 placeholder:text-md" type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-lg block">Password</label>
                        <div className="mt-1">
                            <input className="text-lg p-2 border rounded w-full placeholder:text-slate-400 placeholder:text-md" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <button className="bg-green-500 px-4 py-2 border rounded text-white">Login</button>
                    </div>
                </form>
            </div>
            <style global jsx>{`
                html, body, #__next {
                    height: 100%
                }
            `}</style>
        </>
    )
}

export default Login