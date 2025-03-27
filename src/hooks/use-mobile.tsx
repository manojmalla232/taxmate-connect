import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a default value based on a reasonable assumption
  // This prevents the undefined state during first render
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    // Default to false if window is not available (server-side)
    return false
  })

  React.useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window === 'undefined') return
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Modern API for event listener
    mql.addEventListener("change", onChange)
    
    // Set the initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
