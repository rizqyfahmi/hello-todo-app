import { MenuIcon } from "@heroicons/react/solid"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { ComponentType, ReactChildren, useState } from "react"

type HeaderType = {
    isBlur?: Boolean | false
    children?: ComponentType
}

const Header = (props: HeaderType) => {
    const router = useRouter()
    const [navbar, setNavbar] = useState('max-h-0 ease-out')

    const onShowNavbar = () => {
        setNavbar((navbar === 'max-h-0 ease-out') ? 'max-h-screen ease-in' : 'max-h-0 ease-out')
    }

    const onLogout = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/logout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                Accept: 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        if (!data.status) return;

        router.replace(`${process.env.NEXT_PUBLIC_HOST}`)
    }

    return (
        <div className={`bg-white shadow ${!props.isBlur ? '' : 'blur'}`}>
            <div className="container mx-auto px-2 grid grid-cols-2">
                <div className="col-span-1">
                    <Link href="/"><a className="block py-3 px-2 font-bold">TODO App</a></Link>
                </div>
                <div className="col-span-1 flex flex-row justify-end md:hidden">
                    <button className="m-2 py-1 px-1 border rounded" onClick={onShowNavbar}>
                        <MenuIcon className="w-5 h-5" />
                    </button>
                </div>
                {/* Start | Right Menu */}
                <div className={`${navbar} overflow-hidden transition-max-height duration-1000 col-span-2 md:col-span-1 md:max-h-fit md:flex md:flex-row md:justify-end`}>
                    <div className="flex">
                        <Link href="/"><a className="block py-3 px-2 flex-1 font-semibold text-left text-slate-600 hover:text-slate-900 md:px-3 md:text-center">Dashboard</a></Link>
                    </div>
                    <div className="flex">
                        <Link href="/showcase"><a className="block py-3 px-2 flex-1 font-semibold text-left text-slate-600 hover:text-slate-900 md:px-3 md:text-center">Showcase</a></Link>
                    </div>
                    <div className="flex">
                        <button className="block py-3 px-2 flex-1 font-semibold text-left text-slate-600 hover:text-slate-900 md:px-3 md:text-center" onClick={onLogout}>Logout</button>
                    </div>
                </div>
                {/* End | Right Menu */}
            </div>
        </div>
    )
}

export default Header