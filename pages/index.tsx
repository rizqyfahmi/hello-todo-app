import type { NextPage } from 'next'
import React from 'react'
import withAuth from '../components/withAuth'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col">
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
