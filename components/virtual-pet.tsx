"use client"
import { useState, useEffect } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface VirtualPetProps {
  savingsProgress: number
}

export default function VirtualPet({ savingsProgress = 0 }: VirtualPetProps) {
  const [petSize, setPetSize] = useState(100)
  const [petColor, setPetColor] = useState("#ade6e6")
  const [petMood, setPetMood] = useState("happy")
  const [accessories, setAccessories] = useState<string[]>([])
  const [blinking, setBlinking] = useState(false)
  const [wiggling, setWiggling] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [spinBadge, setSpinBadge] = useState(false)

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 150)
    }, Math.random() * 3000 + 2000)
    
    return () => clearInterval(blinkInterval)
  }, [])
  
  // Wiggle animation
  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      setWiggling(true)
      setTimeout(() => setWiggling(false), 500)
    }, Math.random() * 5000 + 3000)
    
    return () => clearInterval(wiggleInterval)
  }, [])
  
  // Excited animations for 100% completion
  useEffect(() => {
    if (savingsProgress >= 100) {
      // Bounce animation
      const bounceInterval = setInterval(() => {
        setBounce(true)
        setTimeout(() => setBounce(false), 1000)
      }, 4000)
      
      // Badge spin animation
      const spinInterval = setInterval(() => {
        setSpinBadge(true)
        setTimeout(() => setSpinBadge(false), 800)
      }, 2500)
      
      return () => {
        clearInterval(bounceInterval)
        clearInterval(spinInterval)
      }
    }
  }, [savingsProgress])

  // Update pet based on savings progress
  useEffect(() => {
    // Update mood based on progress
    if (savingsProgress < 25) {
      setPetMood("sleepy")
    } else if (savingsProgress < 50) {
      setPetMood("curious")
    } else if (savingsProgress < 75) {
      setPetMood("happy")
    } else {
      setPetMood("excited")
    }

    // Reset accessories and reapply based on current progress
    let currentAccessories: string[] = []
    
    // 25% - Hat accessory
    if (savingsProgress >= 25) {
      currentAccessories.push("hat")
    }
    
    // 50% - Pet grows bigger & keeps hat
    if (savingsProgress >= 50) {
      setPetSize(160)
    } else {
      setPetSize(100)
    }
    
    // 75% - New color variant & keeps hat
    if (savingsProgress >= 75) {
      setPetColor("#FFACAC") // Pink variant
    } else {
      setPetColor("#ade6e6") // Original blue color
    }
    
    // 100% - Special badge (doesn't overlap with hat)
    if (savingsProgress >= 100) {
      currentAccessories.push("badge")
    }
    
    setAccessories(currentAccessories)
  }, [savingsProgress])

  return (
    <div className="flex flex-col items-center mt-8">
      <div 
        className={classNames(
          "relative flex items-center justify-center transition-all duration-500",
          wiggling ? "animate-wiggle" : "",
          bounce ? "animate-bounce" : ""
        )}
        style={{ 
          width: `${petSize}px`, 
          height: `${petSize}px`, 
        }}
      >
        {/* Main body - round blob shape */}
        <div 
          className={classNames(
            "absolute rounded-full shadow-lg transform transition-all duration-300",
            wiggling ? "rotate-3" : "",
            "hover:scale-105"
          )}
          style={{
            width: `${petSize}px`,
            height: `${petSize * 0.9}px`,
            backgroundColor: petColor,
            bottom: 0
          }}
        >
          {/* Bottom curve to make it look like sitting */}
          <div 
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${petSize * 0.8}px`,
              height: `${petSize * 0.4}px`,
              bottom: `-${petSize * 0.1}px`,
              left: `${petSize * 0.1}px`
            }}
          ></div>
        </div>

        {/* Ears */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${petSize * 0.35}px`,
            height: `${petSize * 0.35}px`,
            backgroundColor: petColor,
            left: `${petSize * 0.05}px`,
            top: `-${petSize * 0.15}px`,
            transform: "rotate(-20deg)"
          }}
        >
          <div 
            className="absolute rounded-full" 
            style={{
              width: `${petSize * 0.2}px`,
              height: `${petSize * 0.2}px`,
              backgroundColor: "#FFB7E0",
              top: `${petSize * 0.05}px`,
              left: `${petSize * 0.05}px`
            }}
          ></div>
        </div>

        <div 
          className="absolute rounded-full"
          style={{
            width: `${petSize * 0.35}px`,
            height: `${petSize * 0.35}px`,
            backgroundColor: petColor,
            right: `${petSize * 0.05}px`,
            top: `-${petSize * 0.15}px`,
            transform: "rotate(20deg)"
          }}
        >
          <div 
            className="absolute rounded-full" 
            style={{
              width: `${petSize * 0.2}px`,
              height: `${petSize * 0.2}px`,
              backgroundColor: "#FFB7E0",
              top: `${petSize * 0.05}px`,
              left: `${petSize * 0.1}px`
            }}
          ></div>
        </div>

        {/* Hat accessory (25%) - Positioned directly on the head between ears */}
        {accessories.includes("hat") && (
          <div 
            className="absolute"
            style={{
              top: `-${petSize * 0.2}px`, // Adjusted to sit directly on head
              left: `${petSize * 0.25}px`,
              zIndex: 10, // Ensure hat is on top
            }}
          >
            {/* Main hat body */}
            <div 
              className="bg-purple-500 rounded-t-full"
              style={{
                width: `${petSize * 0.5}px`,
                height: `${petSize * 0.25}px`,
              }}
            ></div>
            {/* Hat brim */}
            <div 
              className="bg-purple-600 rounded-full"
              style={{
                width: `${petSize * 0.6}px`,
                height: `${petSize * 0.12}px`,
                marginTop: `-${petSize * 0.06}px`,
                marginLeft: `-${petSize * 0.05}px`,
              }}
            ></div>
            {/* Hat decoration */}
            <div 
              className="absolute rounded-full bg-yellow-300"
              style={{
                width: `${petSize * 0.12}px`,
                height: `${petSize * 0.12}px`,
                top: `${petSize * 0.04}px`,
                left: `${petSize * 0.19}px`,
              }}
            ></div>
          </div>
        )}

        {/* Face */}
        <div 
          className="absolute"
          style={{
            top: `${petSize * 0.25}px`,
            width: `${petSize * 0.8}px`
          }}
        >
          {/* Eyes */}
          <div className="flex justify-between mx-auto w-full">
            <div 
              className={classNames(
                "relative rounded-full bg-black flex items-center justify-center",
                blinking ? "h-1" : ""
              )}
              style={{
                width: `${petSize * 0.18}px`,
                height: blinking ? `${petSize * 0.01}px` : `${petSize * 0.18}px`,
                transition: "height 0.1s"
              }}
            >
              {!blinking && (
                <>
                  <div 
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${petSize * 0.06}px`,
                      height: `${petSize * 0.06}px`,
                      top: `${petSize * 0.03}px`,
                      left: `${petSize * 0.03}px`
                    }}
                  ></div>
                  <div 
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${petSize * 0.03}px`,
                      height: `${petSize * 0.03}px`,
                      top: `${petSize * 0.07}px`,
                      left: `${petSize * 0.1}px`
                    }}
                  ></div>
                </>
              )}
            </div>
            
            <div 
              className={classNames(
                "relative rounded-full bg-black flex items-center justify-center",
                blinking ? "h-1" : ""
              )}
              style={{
                width: `${petSize * 0.18}px`,
                height: blinking ? `${petSize * 0.01}px` : `${petSize * 0.18}px`,
                transition: "height 0.1s"
              }}
            >
              {!blinking && (
                <>
                  <div 
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${petSize * 0.06}px`,
                      height: `${petSize * 0.06}px`,
                      top: `${petSize * 0.03}px`,
                      left: `${petSize * 0.03}px`
                    }}
                  ></div>
                  <div 
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${petSize * 0.03}px`,
                      height: `${petSize * 0.03}px`,
                      top: `${petSize * 0.07}px`,
                      left: `${petSize * 0.1}px`
                    }}
                  ></div>
                </>
              )}
            </div>
          </div>

          

          {/* Mouth - changes with mood */}
          <div className="mx-auto mt-1">
            {petMood === "sleepy" && (
              <div className="flex justify-center w-full">
              <div 
                className="bg-pink-200 rounded-full"
                style={{
                  width: `${petSize * 0.14}px`,
                  height: `${petSize * 0.08}px`
                }}
              ></div>
              </div>
            )}
            
            {petMood === "curious" && (
              <div className="flex justify-center w-full">
              <div 
                className="bg-pink-200 rounded-b-full"
                style={{
                  width: `${petSize * 0.12}px`,
                  height: `${petSize * 0.08}px`
                }}
              >
                </div>
              </div>
            )}
            
            {petMood === "happy" && (
  <div className="flex justify-center w-full">
    <div 
      className="bg-black rounded-b-full"
      style={{
        width: `${petSize * 0.15}px`,  
        height: `${petSize * 0.08}px`,  
      }}
    ></div>
  </div>
)}
            
            {petMood === "excited" && (
  <div className="flex justify-center w-full">
    <div 
      className="bg-black rounded-b-full"
      style={{
        width: `${petSize * 0.23}px`,  
        height: `${petSize * 0.13}px`,  
      }}
    ></div>
  </div>
)}
          </div>
        </div>

        {/* Cheeks */}
        <div 
          className="absolute flex justify-between"
          style={{
            width: `${petSize * 0.85}px`,
            top: `${petSize * 0.4}px`
          }}
        >
          <div 
            className="rounded-full bg-pink-300 opacity-60"
            style={{
              width: `${petSize * 0.12}px`,
              height: `${petSize * 0.07}px`
            }}
          ></div>
          <div 
            className="rounded-full bg-pink-300 opacity-60"
            style={{
              width: `${petSize * 0.12}px`,
              height: `${petSize * 0.07}px`
            }}
          ></div>
        </div>

        {/* Paws */}
        <div 
          className="absolute flex justify-between"
          style={{
            width: `${petSize * 0.7}px`,
            bottom: `${petSize * 0.05}px`
          }}
        >
          <div 
            className="rounded-full bg-white"
            style={{
              width: `${petSize * 0.2}px`,
              height: `${petSize * 0.12}px`
            }}
          ></div>
          <div 
            className="rounded-full bg-white"
            style={{
              width: `${petSize * 0.2}px`,
              height: `${petSize * 0.12}px`
            }}
          ></div>
        </div>

        {/* Achievement Badge (100%) */}
        {accessories.includes("badge") && (
          <div 
            className={classNames(
              "absolute transition-transform",
              spinBadge ? "animate-spin" : ""
            )}
            style={{
              right: `-${petSize * 0.18}px`,
              bottom: `${petSize * 0.3}px`,
            }}
          >
            {/* Badge circle */}
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg"
              style={{
                width: `${petSize * 0.35}px`,
                height: `${petSize * 0.35}px`,
                border: `${petSize * 0.03}px solid #FFC107`,
              }}
            >
              {/* Star inside badge */}
              <div 
                className="bg-white"
                style={{
                  width: `${petSize * 0.2}px`,
                  height: `${petSize * 0.2}px`,
                  clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              ></div>
            </div>
            {/* Ribbon parts */}
            <div 
              className="absolute bg-red-500"
              style={{
                width: `${petSize * 0.12}px`,
                height: `${petSize * 0.2}px`,
                bottom: `-${petSize * 0.18}px`,
                left: `${petSize * 0.08}px`,
                clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)",
              }}
            ></div>
            <div 
              className="absolute bg-red-500"
              style={{
                width: `${petSize * 0.12}px`,
                height: `${petSize * 0.2}px`,
                bottom: `-${petSize * 0.18}px`,
                right: `${petSize * 0.08}px`,
                clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)",
              }}
            ></div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-medium  px-6 py-3 ">
          {savingsProgress < 25 && "Please feed me with savings! 🥱"}
          {savingsProgress >= 25 && savingsProgress < 50 && "Yay! A new hat! Thank you for saving! 🧢"}
          {savingsProgress >= 50 && savingsProgress < 75 && "Wow, I'm growing bigger! Keep saving! 📈"}
          {savingsProgress >= 75 && savingsProgress < 100 && "Look at my new pink color! Almost there! Keep saving! 🩷"}
          {savingsProgress >= 100 && "WE DID IT! Check out my special badge! Let's celebrate! 🎖️✨🎉"}
        </p>
      </div>
    </div>
  )
}