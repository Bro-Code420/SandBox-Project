'use client'

import React from "react"
import Link from 'next/link'
import { SignIn, SignUp } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BrainCircuit, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Back to Home
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <BrainCircuit className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Welcome to Skillup</h1>
                        <p className="text-muted-foreground mt-2">
                            Sign in to analyze your career readiness
                        </p>
                    </div>

                    {/* Auth Card */}
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="flex justify-center">
                            <SignIn
                                path="/login"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "bg-card border-border/50 shadow-none w-full",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "bg-background border-border hover:bg-muted text-foreground",
                                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                                        footerActionText: "text-muted-foreground",
                                        footerActionLink: "text-primary hover:text-primary/90",
                                        formFieldLabel: "text-foreground",
                                        formFieldInput: "bg-background border-border text-foreground"
                                    }
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="signup" className="flex justify-center">
                            <SignUp
                                path="/login"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "bg-card border-border/50 shadow-none w-full",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "bg-background border-border hover:bg-muted text-foreground",
                                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                                        footerActionText: "text-muted-foreground",
                                        footerActionLink: "text-primary hover:text-primary/90",
                                        formFieldLabel: "text-foreground",
                                        formFieldInput: "bg-background border-border text-foreground"
                                    }
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
