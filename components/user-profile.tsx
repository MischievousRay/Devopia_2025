"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface UserProfileProps {
  user: {
    name: string
    email: string
    image?: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [name, setName] = useState(user.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update user profile in Supabase
      const { error } = await supabase.from("users").update({ full_name: name }).eq("email", user.email)

      if (error) throw error
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || ""} alt={name} />
            <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">Profile Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
          <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2">
          <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
