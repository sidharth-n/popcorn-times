import React, { useEffect, useState } from "react"
import Lottie from "lottie-react"

interface LoadingLogoProps {
  onLoadingComplete: () => void
}

const LoadingLogo: React.FC<LoadingLogoProps> = ({ onLoadingComplete }) => {
  const [logoData, setLogoData] = useState<any>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Load the Lottie animation data
    fetch("/logo.json")
      .then(response => response.json())
      .then(data => {
        setLogoData(data)
      })
      .catch(error => {
        console.error("Error loading logo animation:", error)
        // Even if there's an error, we should continue to the app
        setTimeout(() => onLoadingComplete(), 1000)
      })

    // Set a timeout to ensure we don't wait indefinitely for the animation
    const timeoutId = setTimeout(() => {
      if (!animationComplete) {
        onLoadingComplete()
      }
    }, 5000) // Maximum wait time before showing the app

    return () => clearTimeout(timeoutId)
  }, [animationComplete, onLoadingComplete])

  const handleAnimationComplete = () => {
    setAnimationComplete(true)
    // Wait a moment before transitioning away from loading screen
    setTimeout(() => {
      onLoadingComplete()
    }, 300)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
        {logoData && (
          <Lottie
            animationData={logoData}
            loop={false}
            autoplay={true}
            onComplete={handleAnimationComplete}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
            }}
          />
        )}
      </div>
    </div>
  )
}

export default LoadingLogo
