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

        useEffect(() => {
            const accessToken = (props?.cookie['access-token'] ?? false)
            const refreshToken = (props?.cookie['refresh-token'] ?? false)

            const onRefreshToken = () => {
                fetch(`${process.env.NEXT_PUBLIC_API_HOST}/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        Accept: 'application/json'
                    },
                    credentials: 'include'
                })
                .then((r) => r.json())
                .then((response) => {
                    
                    if (response.status) {
                        return setIsVerified(true)
                    }

                    router.replace('/')
                    setIsVerified(false)
                })
            }

            if ((!accessToken) && (refreshToken)) {
                return onRefreshToken()   
            }

            return setIsVerified(true)
        }, [])

        return (
            isVerified ? <WrappedComponent {...props} /> : null
        )
    }
}
