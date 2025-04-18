"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VirtualPetProps {
  savingsProgress: number
}

export function VirtualPet({ savingsProgress }: VirtualPetProps) {
  const [petSize, setPetSize] = useState(100)
  const [petColor, setPetColor] = useState("#e06666")
  const [accessories, setAccessories] = useState<string[]>([])
  const [animation, setAnimation] = useState("")

  useEffect(() => {
    // Update pet based on savings progress
    if (savingsProgress >= 25) {
      setAccessories((prev) => {
        if (!prev.includes("hat")) return [...prev, "hat"]
        return prev
      })
    }

    if (savingsProgress >= 50) {
      setPetSize(120)
    }

    if (savingsProgress >= 75) {
      setPetColor("#82ca9d")
    }

    if (savingsProgress >= 100) {
      setAnimation("bounce")
      setAccessories((prev) => {
        if (!prev.includes("badge")) return [...prev, "badge"]
        return prev
      })
    }
  }, [savingsProgress])

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-500",
          animation === "bounce" && "animate-bounce",
        )}
        style={{
          width: `${petSize}px`,
          height: `${petSize}px`,
          backgroundColor: petColor,
        }}
      >
        {/* Pet face */}
        <div className="absolute" style={{ top: "30%" }}>
          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-black"></div>
            <div className="w-4 h-4 rounded-full bg-black"></div>
          </div>
        </div>
        <div className="absolute" style={{ top: "50%" }}>
          <div className="w-8 h-4 rounded-full bg-white"></div>
        </div>

        {/* Hat accessory */}
        {accessories.includes("hat") && (
          <div
            className="absolute bg-blue-400 rounded-t-full"
            style={{
              width: `${petSize * 0.6}px`,
              height: `${petSize * 0.3}px`,
              top: `-${petSize * 0.25}px`,
            }}
          ></div>
        )}

        {/* Badge accessory */}
        {accessories.includes("badge") && (
          <div
            className="absolute bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              width: `${petSize * 0.3}px`,
              height: `${petSize * 0.3}px`,
              right: `-${petSize * 0.1}px`,
              bottom: `${petSize * 0.1}px`,
            }}
          >
            💰
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium">
          {savingsProgress < 25 && "Feed me with savings!"}
          {savingsProgress >= 25 && savingsProgress < 50 && "Looking good with my new hat!"}
          {savingsProgress >= 50 && savingsProgress < 75 && "Growing stronger with your savings!"}
          {savingsProgress >= 75 && savingsProgress < 100 && "Almost there! Keep saving!"}
          {savingsProgress >= 100 && "Woohoo! You reached your goal!"}
        </p>
      </div>
    </div>
  )
}
