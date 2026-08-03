"use client";

import { useEffect, useRef } from "react";

export function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize the audio object only on the client side
    audioRef.current = new Audio("/ui-click.mp3");
    
    // Set volume to 30% so it feels premium and subtle, not loud and jarring
    audioRef.current.volume = 0.3;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the clicked element (or its parent) is a button or a link
      const isClickable = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest('[role="button"]');

      if (isClickable && audioRef.current) {
        // Reset the audio to the beginning in case of rapid clicking
        audioRef.current.currentTime = 0;
        
        // Play the sound (catch block prevents browser autoplay restriction errors)
        audioRef.current.play().catch((err) => {
          console.warn("Audio playback prevented by browser:", err);
        });
      }
    };

    // Attach the listener to the entire document
    document.addEventListener("click", handleGlobalClick);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return <>{children}</>;
}