"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useConvexAuth, useMutation } from "convex/react"
import { useEffect } from "react"
import { api } from "@/convex/_generated/api"

export default function SyncUser() {
    const { isLoaded, isSignedIn, user } = useUser()
    const { isAuthenticated } = useConvexAuth()
    const storeUser = useMutation(api.users.storeUser)
    const [synced, setSynced] = useState(false)

    useEffect(() => {
        if (isLoaded && isSignedIn && user && isAuthenticated && !synced) {
            console.log("Syncing user with Convex...")
            storeUser()
                .then(() => {
                    console.log("User synced successfully")
                    setSynced(true)
                })
                .catch((err) => {
                    console.error("Error syncing user:", err)
                    // If it's an auth error, we might want to wait and retry, 
                    // but for now let's just log it to avoid spamming the server.
                })
        }
    }, [isLoaded, isSignedIn, user, isAuthenticated, storeUser, synced])

    return null
}
