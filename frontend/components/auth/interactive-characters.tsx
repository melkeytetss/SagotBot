"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface InteractiveCharactersProps {
  isPasswordFocused?: boolean;
  isEmailFocused?: boolean;
  isTyping?: boolean;
  authStatus?: "idle" | "loading" | "success" | "error";
  className?: string;
}

export function InteractiveCharacters({
  isPasswordFocused = false,
  isEmailFocused = false,
  isTyping = false,
  authStatus = "idle",
  className = "",
}: InteractiveCharactersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Spring physics configuration for organic eye momentum (Emil Kowalski principles)
  const eyeSpringConfig = { stiffness: 160, damping: 15, mass: 0.45 };

  // Motion values for target offsets
  const orangeTargetX = useMotionValue(0);
  const orangeTargetY = useMotionValue(0);
  const orangeSpringX = useSpring(orangeTargetX, eyeSpringConfig);
  const orangeSpringY = useSpring(orangeTargetY, eyeSpringConfig);

  const purpleTargetX = useMotionValue(0);
  const purpleTargetY = useMotionValue(0);
  const purpleSpringX = useSpring(purpleTargetX, eyeSpringConfig);
  const purpleSpringY = useSpring(purpleTargetY, eyeSpringConfig);

  const navyTargetX = useMotionValue(0);
  const navyTargetY = useMotionValue(0);
  const navySpringX = useSpring(navyTargetX, eyeSpringConfig);
  const navySpringY = useSpring(navyTargetY, eyeSpringConfig);

  const yellowTargetX = useMotionValue(0);
  const yellowTargetY = useMotionValue(0);
  const yellowSpringX = useSpring(yellowTargetX, eyeSpringConfig);
  const yellowSpringY = useSpring(yellowTargetY, eyeSpringConfig);

  const tiltTargetX = useMotionValue(0);
  const tiltTargetY = useMotionValue(0);
  const tiltSpringX = useSpring(tiltTargetX, eyeSpringConfig);
  const tiltSpringY = useSpring(tiltTargetY, eyeSpringConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Store last known pointer position so we can instantly update gaze on state transitions
  const lastPointerRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update target positions on pointer move / click / focus
  useEffect(() => {
    if (!mounted) return;

    // Initialize with center of window if no pointer event yet
    if (lastPointerRef.current.x === 0 && typeof window !== "undefined") {
      lastPointerRef.current = { x: window.innerWidth * 0.65, y: window.innerHeight * 0.4 };
    }

    const updateGaze = (clientX: number, clientY: number) => {
      lastPointerRef.current = { x: clientX, y: clientY };

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = clientX - (rect.left + rect.width / 2);
      const relY = clientY - (rect.top + rect.height / 2);

      // Body 3D tilt
      if (isPasswordFocused) {
        tiltTargetX.set(0);
        tiltTargetY.set(0);
        orangeTargetX.set(0);
        orangeTargetY.set(0);
        purpleTargetX.set(0);
        purpleTargetY.set(0);
        navyTargetX.set(0);
        navyTargetY.set(0);
        yellowTargetX.set(0);
        yellowTargetY.set(0);
        return;
      }

      tiltTargetX.set(Math.max(-8, Math.min(8, relX * 0.015)));
      tiltTargetY.set(Math.max(-6, Math.min(6, relY * 0.015)));

      const calcOffset = (offsetX: number, offsetY: number, maxRadius: number) => {
        const dx = relX - offsetX;
        const dy = relY - offsetY;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const clampedDist = Math.min(distance * 0.05, maxRadius);
        return {
          x: Math.cos(angle) * clampedDist,
          y: Math.sin(angle) * clampedDist,
        };
      };

      const o = calcOffset(-60, 100, 7);
      orangeTargetX.set(o.x);
      orangeTargetY.set(o.y);

      const p = calcOffset(-20, -70, 10);
      purpleTargetX.set(p.x);
      purpleTargetY.set(p.y);

      const n = calcOffset(50, -10, 8);
      navyTargetX.set(n.x);
      navyTargetY.set(n.y);

      const y = calcOffset(110, 40, 7);
      yellowTargetX.set(y.x);
      yellowTargetY.set(y.y);
    };

    // Immediately evaluate gaze using last pointer position when state changes
    updateGaze(lastPointerRef.current.x, lastPointerRef.current.y);

    const handlePointerEvent = (e: MouseEvent | PointerEvent) => {
      updateGaze(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handlePointerEvent, { passive: true });
    window.addEventListener("pointerdown", handlePointerEvent, { passive: true });
    window.addEventListener("mousemove", handlePointerEvent, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerEvent);
      window.removeEventListener("pointerdown", handlePointerEvent);
      window.removeEventListener("mousemove", handlePointerEvent);
    };
  }, [mounted, isPasswordFocused, orangeTargetX, orangeTargetY, purpleTargetX, purpleTargetY, navyTargetX, navyTargetY, yellowTargetX, yellowTargetY, tiltTargetX, tiltTargetY]);

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      className={`relative w-full max-w-[520px] h-[480px] flex items-end justify-center select-none overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 w-[420px] h-[80px] bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Joy Particles when Email is focused */}
      <AnimatePresence>
        {isEmailFocused && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 350, x: 120 + i * 45, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [350, 120 - (i % 3) * 40],
                  x: [120 + i * 45, 110 + i * 50 + (i % 2 === 0 ? 20 : -20)],
                  scale: [0.5, 1.2, 0.8],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.25,
                  ease: "easeOut",
                }}
                className="absolute text-amber-300"
              >
                {i % 2 === 0 ? (
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                ) : (
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* CHARACTER ENSEMBLE CONTAINER */}
      <motion.div
        className="relative w-[460px] h-[420px] flex items-end justify-center"
        style={{
          rotateY: isPasswordFocused ? 0 : tiltSpringX,
          rotateX: isPasswordFocused ? 0 : tiltSpringY,
        }}
        animate={
          authStatus === "success"
            ? { y: [0, -28, 0, -12, 0], scale: [1, 1.04, 1] }
            : authStatus === "error"
            ? { x: [-6, 6, -4, 4, 0] }
            : authStatus === "loading"
            ? { y: [0, -4, 0] }
            : { y: 0 }
        }
        transition={
          authStatus === "loading"
            ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
            : authStatus === "success" || authStatus === "error"
            ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.3, ease: "easeOut" }
        }
      >
        {/* 1. PURPLE TALL PILL (Tall & Expressive) */}
        <motion.div
          className="absolute left-[135px] bottom-0 w-[115px] h-[340px] rounded-[58px] bg-[#7c3aed] shadow-2xl flex flex-col items-center pt-10 z-10 cursor-pointer"
          animate={
            isPasswordFocused
              ? {
                  // Eyes covered/closed but still continuously breathing and swaying
                  y: [6, 1, 6],
                  scaleY: [0.97, 1.01, 0.97],
                  rotate: [0, 1, 0],
                }
              : isEmailFocused
              ? {
                  // Continuous happy joyful bobbing loop
                  y: [0, -14, 0],
                  scaleY: [1, 1.05, 0.98, 1],
                  rotate: [-1.5, 1.5, -1.5],
                }
              : {
                  // Casual organic idle breathing loop
                  y: [0, -7, 0],
                  scaleY: [1, 1.025, 1],
                  rotate: [0, 0, 0],
                }
          }
          transition={{
            repeat: Infinity,
            duration: isEmailFocused ? 1.8 : isPasswordFocused ? 3.2 : 3.4,
            ease: "easeInOut",
          }}
        >
          {/* Eyebrows */}
          <motion.div
            className="flex gap-7 mb-2"
            animate={
              isPasswordFocused
                ? { y: -4, rotate: 5 }
                : isEmailFocused
                ? { y: -6, rotate: 0, scale: 1.15 }
                : authStatus === "error"
                ? { y: 4, rotate: -8 }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <div className="w-5 h-1.5 bg-white/90 rounded-full" />
            <div className="w-5 h-1.5 bg-white/90 rounded-full" />
          </motion.div>

          {/* Eyes (White Sclera + Black Pupil) */}
          <div className="relative flex gap-5 items-center">
            {isPasswordFocused ? (
              // Closed/Covered Eyes when Password is typed
              <div className="flex gap-5 items-center pt-2">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="w-7 h-1.5 bg-white rounded-full"
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="w-7 h-1.5 bg-white rounded-full"
                />
              </div>
            ) : (
              <>
                {/* Left Eye */}
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative overflow-hidden shadow-inner"
                >
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-[#111827]"
                    style={{ x: purpleSpringX, y: purpleSpringY }}
                  />
                </motion.div>
                {/* Right Eye */}
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative overflow-hidden shadow-inner"
                >
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-[#111827]"
                    style={{ x: purpleSpringX, y: purpleSpringY }}
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* Hands covering eyes when password focused */}
          {isPasswordFocused && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="absolute top-14 flex gap-3 z-30"
            >
              <div className="w-9 h-8 bg-[#6d28d9] rounded-full border-2 border-white/20 shadow-md" />
              <div className="w-9 h-8 bg-[#6d28d9] rounded-full border-2 border-white/20 shadow-md" />
            </motion.div>
          )}

          {/* Smile: Becomes a wide open happy grin when email is focused! */}
          <motion.div
            className="border-white rounded-b-full mt-5 bg-purple-950/40"
            animate={
              isPasswordFocused
                ? { width: 14, height: 2, borderWidth: 2 }
                : isEmailFocused
                ? { width: 28, height: 16, borderWidth: 2.5, backgroundColor: "#ffffff" }
                : { width: 24, height: 11, borderWidth: 2, backgroundColor: "rgba(255, 255, 255, 0)" }
            }
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          />
        </motion.div>

        {/* 2. NAVY SLATE PILL (Middle Right, Behind) */}
        <motion.div
          className="absolute left-[225px] bottom-0 w-[95px] h-[240px] rounded-[48px] bg-[#1e2538] shadow-xl flex flex-col items-center pt-8 z-0"
          animate={
            isPasswordFocused
              ? {
                  // Shy peek/innocent look up, continuously breathing behind
                  y: [33, 27, 33],
                  scaleY: [0.98, 1.015, 0.98],
                  opacity: 0.8,
                }
              : isEmailFocused
              ? {
                  // Continuous happy bobbing rhythm
                  y: [0, -11, 0],
                  scaleY: [1, 1.04, 0.98, 1],
                  rotate: [1.5, -1.5, 1.5],
                  opacity: 1,
                }
              : {
                  // Casual idle bobbing
                  y: [0, -6, 0],
                  scaleY: [1, 1.02, 1],
                  opacity: 1,
                }
          }
          transition={{
            repeat: Infinity,
            duration: isEmailFocused ? 2.0 : isPasswordFocused ? 3.6 : 3.8,
            ease: "easeInOut",
          }}
        >
          {/* Eyebrows */}
          <motion.div
            className="flex gap-5 mb-2"
            animate={isEmailFocused ? { y: -4, scale: 1.1 } : { y: 0 }}
          >
            <div className="w-4 h-1 bg-white/70 rounded-full" />
            <div className="w-4 h-1 bg-white/70 rounded-full" />
          </motion.div>

          {/* Eyes */}
          <div className="flex gap-4 items-center">
            {isPasswordFocused ? (
              // Looking up innocently
              <div className="flex gap-4 pt-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-start justify-center pt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 -translate-y-0.5" />
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-start justify-center pt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 -translate-y-0.5" />
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden"
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-slate-900"
                    style={{ x: navySpringX, y: navySpringY }}
                  />
                </motion.div>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden"
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-slate-900"
                    style={{ x: navySpringX, y: navySpringY }}
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* Small Smile */}
          <motion.div
            animate={
              isEmailFocused
                ? { width: 18, height: 9, borderColor: "#ffffff" }
                : { width: 14, height: 6 }
            }
            className="border-b-2 border-white/80 rounded-b-full mt-4"
          />
        </motion.div>

        {/* 3. YELLOW PILLAR (Far Right) */}
        <motion.div
          className="absolute left-[295px] bottom-0 w-[105px] h-[210px] rounded-t-[52px] bg-[#fbbf24] shadow-2xl flex flex-col items-center pt-8 z-10"
          animate={
            isPasswordFocused
              ? {
                  // Innocent whistling look up with continuous gentle sway & breathing
                  y: [-3, -8, -3],
                  rotate: [2.5, 5, 2.5],
                  scaleY: [0.99, 1.02, 0.99],
                }
              : isEmailFocused
              ? {
                  // Cheerful swaying & bouncing loop
                  y: [0, -13, 0],
                  rotate: [-2.5, 2.5, -2.5],
                  scaleY: [1, 1.045, 1],
                }
              : {
                  // Casual idle swaying & breathing
                  rotate: [-1.5, 1.5, -1.5],
                  y: [0, -5, 0],
                  scaleY: [1, 1.02, 1],
                }
          }
          transition={{
            repeat: Infinity,
            duration: isEmailFocused ? 2.1 : isPasswordFocused ? 4.0 : 4.2,
            ease: "easeInOut",
          }}
        >
          {/* Eyebrows */}
          <motion.div
            className="flex gap-6 mb-2"
            animate={isEmailFocused ? { y: -5, rotate: [0, -5, 0] } : { y: 0 }}
            transition={isEmailFocused ? { duration: 0.5, ease: "easeOut" } : { type: "spring", stiffness: 300, damping: 18 }}
          >
            <div className="w-4 h-1 bg-amber-950/70 rounded-full" />
            <div className="w-4 h-1 bg-amber-950/70 rounded-full" />
          </motion.div>

          {/* Eyes (Dark Pupils) */}
          <div className="flex gap-5 items-center">
            {isPasswordFocused ? (
              // Whistling innocent look upward
              <div className="flex gap-5">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-950 -translate-y-1.5" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-950 -translate-y-1.5" />
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-5 h-5 flex items-center justify-center"
                >
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-amber-950"
                    style={{ x: yellowSpringX, y: yellowSpringY }}
                  />
                </motion.div>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-5 h-5 flex items-center justify-center"
                >
                  <motion.div
                    className="w-3.5 h-3.5 rounded-full bg-amber-950"
                    style={{ x: yellowSpringX, y: yellowSpringY }}
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* Smile or Whistle Mouth */}
          <motion.div
            animate={
              isPasswordFocused
                ? { borderRadius: "9999px", width: 6, height: 6, borderWidth: 2 }
                : isEmailFocused
                ? { width: 22, height: 12, borderWidth: 2.5, backgroundColor: "#451a03" }
                : { width: 18, height: 8, borderWidth: 2, backgroundColor: "rgba(69, 26, 3, 0)" }
            }
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="border-amber-950 rounded-b-full mt-4"
          />
        </motion.div>

        {/* 4. ORANGE DOME (Front Center-Left Semicircle) */}
        <motion.div
          className="absolute left-[35px] bottom-0 w-[235px] h-[130px] rounded-t-[118px] bg-[#ff6b4a] shadow-2xl flex flex-col items-center pt-7 z-20 cursor-pointer"
          animate={
            isPasswordFocused
              ? {
                  // Shy side-eye glance, with continuous squishy breathing
                  scaleY: [0.97, 1.02, 0.97],
                  scaleX: [1.02, 0.98, 1.02],
                  x: -6,
                  y: [0, 2, 0],
                }
              : isEmailFocused
              ? {
                  // Continuous joyful squishy bouncy groove that NEVER stops or hitches
                  scaleY: [1, 1.07, 0.95, 1],
                  scaleX: [1, 0.94, 1.04, 1],
                  y: [0, -8, 1, 0],
                  x: 0,
                }
              : {
                  // Casual squishy organic breathing loop
                  scaleY: [1, 1.035, 1],
                  scaleX: [1, 0.98, 1],
                  y: [0, 2, 0],
                  x: 0,
                }
          }
          transition={{
            repeat: Infinity,
            duration: isEmailFocused ? 1.6 : isPasswordFocused ? 3.0 : 2.8,
            ease: "easeInOut",
          }}
        >
          {/* Eyebrows */}
          <motion.div
            className="flex gap-14 mb-2"
            animate={
              isPasswordFocused
                ? { y: -2, rotate: -4 }
                : isEmailFocused
                ? { y: -5, rotate: 2, scale: 1.1 }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <div className="w-6 h-1.5 bg-[#431407] rounded-full" />
            <div className="w-6 h-1.5 bg-[#431407] rounded-full" />
          </motion.div>

          {/* Eyes (Dark Circles) */}
          <div className="flex gap-12 items-center">
            {isPasswordFocused ? (
              // Shy side-eye glance
              <div className="flex gap-12">
                <div className="w-4 h-4 rounded-full bg-[#431407] -translate-x-1.5" />
                <div className="w-4 h-4 rounded-full bg-[#431407] -translate-x-1.5" />
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-[#431407]"
                    style={{ x: orangeSpringX, y: orangeSpringY }}
                  />
                </motion.div>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-[#431407]"
                    style={{ x: orangeSpringX, y: orangeSpringY }}
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* Cute Smile: Expands to big happy mouth on email focus! */}
          <motion.div
            className="border-[#431407] rounded-b-full mt-3"
            animate={
              isEmailFocused
                ? { width: 34, height: 18, borderWidth: 3.5, backgroundColor: "#7c2d12" }
                : { width: 30, height: 12, borderWidth: 3, backgroundColor: "rgba(124, 45, 18, 0)" }
            }
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          />

          {/* Blushing cheeks when email is focused (happy blush) or password focused */}
          {(isPasswordFocused || isEmailFocused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isEmailFocused ? 0.8 : 0.6 }}
              className="absolute top-14 w-full flex justify-between px-8"
            >
              <div className="w-5 h-2.5 bg-rose-500 rounded-full blur-[2px]" />
              <div className="w-5 h-2.5 bg-rose-500 rounded-full blur-[2px]" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
