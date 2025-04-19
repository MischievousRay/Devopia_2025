"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth0Login = () => {
    setIsLoading(true)
    window.location.href = "/api/auth/login"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <PiggyBank className="h-8 w-8" />
        <span>MyBudgetAI</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <Tabs defaultValue="auth0" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auth0">Auth0</TabsTrigger>
            <TabsTrigger value="credentials">Email & Password</TabsTrigger>
          </TabsList>
          <TabsContent value="auth0">
            <CardContent className="pt-4">
              <Button className="w-full" onClick={handleAuth0Login} disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign in with Auth0"}
              </Button>
            </CardContent>
          </TabsContent>
          <TabsContent value="credentials">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Sign in</Button>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
