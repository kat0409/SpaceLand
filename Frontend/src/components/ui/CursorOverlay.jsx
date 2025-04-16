// src/components/ui/CursorOverlay.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorOverlay() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Detect hover elements
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el?.tagName === "A" || el?.tagName === "BUTTON" || el?.closest("button") || el?.closest("a")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    const handleClick = () => {
      setClicking(true);
      setTimeout(() => setClicking(false), 150);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ translateX: mouseX, translateY: mouseY }}
      >
        {!hovering && (
          <motion.div
            className={`w-5 h-5 rounded-full bg-purple-500 mix-blend-difference`}
            animate={{ scale: clicking ? 1.8 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        )}
      </motion.div>

      {/* Outer Reactive Ring */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none border-2 border-purple-400 rounded-full"
        style={{
          translateX: mouseX,
          translateY: mouseY,
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
        }}
        animate={{ scale: hovering ? 1.4 : clicking ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
    </>
  );
}
