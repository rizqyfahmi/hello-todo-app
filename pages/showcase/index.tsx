import { NextPage } from "next";
import { BeakerIcon, MenuIcon } from '@heroicons/react/solid'
import Link from "next/link";
import withAuth from "../../components/withAuth";
import React, { useState } from "react";
import Header from "../../components/Header";

const Showcase: NextPage = () => {
    return (
        <div className="h-full flex flex-col">
            <Header />
            <div className="flex-1 flex justify-center items-center">
                <h1 className="font-semibold md:text-xl">Welcome to <label className="text-sky-600">Showcase</label></h1>
            </div>
            <style global jsx>{`
                html, body, #__next {
                    height: 100%
                }
            `}</style>
        </div>
    )
}

export default withAuth(Showcase)