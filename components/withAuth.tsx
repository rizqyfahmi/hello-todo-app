import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"

interface responseData {
    status: Boolean | false,
    message: String
}


export default function withAuth(WrappedComponent: React.ComponentType<any>) {
    return function Wrapper(props: any) {
        const [isVerified, setIsVerified] = useState(false)
        const router = useRouter()

        const onRefreshToken = useCallback(async () => {
            const responseRefreshToken = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    Accept: 'application/json'
                },
                credentials: 'include'
            })

            const data = await responseRefreshToken.json()
            console.log('refresh-token: ', data)

            if (data.status) {
                return setIsVerified(true)
            }

            router.replace('/')
            setIsVerified(false)
        }, [router])

        const onCheckAccessToken = useCallback(async () => {
            const responseAccessToken = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/validate-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json'
                },
                credentials: 'include'
            })

            const data: responseData = await responseAccessToken.json()
            const status = data.status
            console.log('access-token: ', data)

            if (status) {
                return setIsVerified(true)
            }

            onRefreshToken()
        }, [onRefreshToken])

        useEffect(() => {
            onCheckAccessToken()
        }, [onCheckAccessToken])

        return (
            isVerified ? <WrappedComponent {...props} /> : null
        )
    }
}
