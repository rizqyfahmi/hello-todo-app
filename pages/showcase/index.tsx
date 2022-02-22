import { GetServerSidePropsContext, NextPage } from "next";
import { PencilAltIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/solid'
import moment from "moment";
import withAuth from "../../components/withAuth";
import React, { MouseEventHandler, useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import useSWR from "swr"
import { cookieToJSON, URLParameterBuilder } from "../../helpers";

interface ShowcaseType {
    id: Number | '',
    title: string | '',
    description: string | '',
    is_done: Boolean | false,
    is_selected: string | 'max-w-0',
    updated_at: Date | '',
    created_at: Date | ''
}

const Showcase: NextPage = (props) => {

    const [tasks, setTasks] = useState<ShowcaseType[]>([])
    const [editTask, setEditTask] = useState<ShowcaseType | null>(null)
    const [actionType, setActionType] = useState<string>("Save")

    const { data } = useSWR<ShowcaseType[], any>(`${process.env.NEXT_PUBLIC_API_HOST}/restricted/tasks`, async (url) => {
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
            return []
        }

        return data.data.map((item: ShowcaseType) => ({
            ...item,
            is_selected: 'max-w-0'
        }))
    })
    
    const onSelected = (item: ShowcaseType) => {
        const items = tasks.map((task) => {
            if (task.id === item.id) {
                return {
                    ...task,
                    is_selected: task.is_selected === 'max-w-0' ? 'max-w-md' : 'max-w-0'
                }
            }

            return task
        })

        setTasks(items)
    }

    const onCreate = () => {
        setActionType('Save')
        setEditTask({
            id: '',
            title: '',
            description: '',
            is_done: false,
            is_selected: 'max-w-0',
            updated_at: new Date(),
            created_at: new Date()
        })
    }

    const onStore = async () => {
        if (!editTask) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/restricted/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json'
            },
            credentials: 'include',
            body: URLParameterBuilder(editTask)
        })

        const data = await response.json()
        

        if (!data.status) return;

        setTasks([
            data.data,
            ...tasks
        ])

        setEditTask(null)
    }

    const onEdit = (item: ShowcaseType) => {
        setActionType('Update')
        setEditTask(item)
    }

    const onEditTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editTask) return

        setEditTask({
            ...editTask,
            title: e.target.value
        })
    }

    const onEditDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!editTask) return

        setEditTask({
            ...editTask,
            description: e.target.value
        })
    }

    const onUpdate = async () => {
        if (!editTask) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/restricted/tasks/${editTask?.id ?? ''}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json'
            },
            credentials: 'include',
            body: URLParameterBuilder(editTask)
        })

        const data = await response.json()
        
        if (!data.status) return;

        const items = tasks.map((task) => {
            if (task.id === editTask.id) {
                return {
                    ...editTask,
                    is_selected: 'max-w-0',
                }
            }

            return task
        })

        setTasks(items)

        setEditTask(null)
    }

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()

        if (actionType == 'Update') {
            return onUpdate()
        }

        onStore()
    }

    const onDelete = async (item: ShowcaseType) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/restricted/tasks/${item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()

        if (!data.status) return;

        const items = tasks.filter((task: ShowcaseType) => task.id != item.id)
        setTasks(items)
    }

    useEffect(() => {
        if (!data) return;

        setTasks(data)
    }, [data])

    return (
        <div className="font-nunito pb-4">
            <Header isBlur={!!editTask}/>
            <div className={`container px-4 py-6 mx-auto flex justify-between items-center ${!editTask ? '' : 'blur'}`}>
                <h1 className="font-semibold text-2xl">Showcase</h1>
                <button className="flex items-center mt-1 bg-green-600 py-2 px-3 text-white rounded-full active:bg-green-800" onClick={onCreate}>
                    <PlusCircleIcon height={18} width={18} className="inline-block md:mr-2" /> <label className="hidden md:inline">Add new task</label>
                </button>
            </div>
            <div className={`container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ${!editTask ? '' : 'blur'}`}>
                {
                    tasks.map((task: ShowcaseType) => (
                        <div className="border rounded flex justify-end" key={task?.id.toString()}>
                            <div className="p-2 flex-1" onClick={() => onSelected(task)}>
                                <div className="grid grid-cols-2">
                                    <label className="block col-span-1 truncate text-left">{task?.title ?? ''}</label>
                                    <label className="text-xs col-span-1 text-slate-500 text-right">{moment(task?.created_at).locale('id').format('hh:mm:ss')}</label>
                                </div>
                                <p className="block col-span-2 truncate text-slate-500 text-sm text-left">{task?.description ?? ''}</p>
                            </div>
                            <div className={`flex items-center transition-max-width duration-500 ease-in-out overflow-hidden ${task.is_selected}  bg-slate-600 rounded-tr rounded-br h-full`}>
                                <button className="px-2" onClick={() => onEdit(task)}><PencilAltIcon height={15} width={15} className="text-white" /></button>
                                <button className="px-2" onClick={() => onDelete(task)}><TrashIcon height={15} width={15} className="text-white" /></button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={`fixed top-0 right-0 bottom-0 bg-white shadow transition-transform duration-500 ease-in-out overflow-hidden w-full md:w-4/12 lg:w-3/12 ${!editTask ? 'translate-x-full' : 'translate-x-0'}`}>
                <form className="p-5">
                    <div className="mt-2">
                        <label className="text-md block">Username</label>
                        <div className="mt-1">
                            <input className="text-sm p-2 border rounded w-full placeholder:text-slate-400 placeholder:text-md" type="text" placeholder="Enter username" value={editTask?.title || ""} onChange={onEditTitle} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-md block">Description</label>
                        <div className="mt-1">
                            <textarea className="text-sm p-2 border rounded w-full resize-none placeholder:text-slate-400 placeholder:text-md" placeholder="Enter description" value={editTask?.description || ""} onChange={onEditDescription}></textarea>
                        </div>
                    </div>
                    <div className="mt-6 text-right whitespace-nowrap">
                        <button type="button" className="bg-slate-500 px-4 py-2 border rounded text-white mr-2" onClick={() => setEditTask(null)}>Cancel</button>
                        <button className="bg-green-500 px-4 py-2 border rounded text-white" onClick={onSubmitForm}>{actionType}</button>
                    </div>
                </form>
            </div>
            <div>
                <svg height="100%" width="100%">
                    <defs>
                        <filter id="f1" x="0" y="0">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                        </filter>
                    </defs>
                </svg>
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