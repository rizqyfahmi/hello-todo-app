import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import withAuth from '../components/withAuth'
import Header from '../components/Header'
import { cookieToJSON } from '../helpers'

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col font-nunito">
		<Header />
		<div className="flex-1 flex justify-center items-center">
			<h1 className="font-semibold md:text-xl">Welcome to <label className="text-sky-600">Dashboard</label></h1>
		</div>
		<style global jsx>{`
			html, body, #__next {
				height: 100%
			}
		`}</style>
    </div>
  )
}

export default withAuth(Home)

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const cookie: string = req.headers.cookie || ''
	const result = cookieToJSON(cookie)

	return {
		props: {
			cookie: result
		}
	}
}