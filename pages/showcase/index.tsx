import { GetServerSidePropsContext, NextPage } from "next";
import { PlusCircleIcon } from '@heroicons/react/solid'
import moment from "moment";
import withAuth from "../../components/withAuth";
import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import useSWR from "swr"
import { cookieToJSON } from "../../helpers";

interface ShowcaseType {
    id: Number | '',
    title: String | '',
    description: String | '',
    is_done: Boolean | false,
    updated_at: Date | '',
    created_at: Date | ''
}
interface ShowcaseProps {
    props: Array<ShowcaseType>
}

const Showcase: NextPage = (props) => {

    const [tasks, setTasks] = useState([])

    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_HOST}/restricted/tasks`, async (url) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        if (!data.status) {
            return null
        }

        return data
    }, { refreshInterval: 5000 })

    useEffect(() => {
        if (!data) return;

        setTasks(data.data)
    }, [data])

    return (
        <div className="font-nunito">
            <Header />
            <div className="container px-4 py-6 mx-auto flex justify-between items-center">
                <h1 className="font-semibold text-2xl">Showcase</h1>
                <button className="flex items-center mt-1 bg-green-600 py-2 px-3 text-white rounded-full active:bg-green-800 ">
                    <PlusCircleIcon height={18} width={18} className="inline-block md:mr-2" /> <label className="hidden md:inline">Add new task</label>
                </button>
            </div>
            <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-2">
                {
                    tasks.map((task: ShowcaseType) => (
                        <div className="border rounded p-2" key={task?.id.toString()}>
                            <div className="flex justify-between">
                                <label className="block col-span-1">{task?.title ?? ''}</label>
                                <label className="text-xs col-span-1 text-slate-500 text-right">{moment(task?.created_at).locale('id').format('hh:mm:ss')}</label>
                            </div>
                            <p className="block col-span-2 truncate text-slate-500 text-sm">{task?.description ?? ''}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default withAuth(Showcase)

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const cookie: string = req.headers.cookie || ''
    const result = cookieToJSON(cookie)

    return {
        props: {
            cookie: result
        }
    }
}