"use client";

/**
 * ScrollReveal & ScrollTransform — Emil Kowalski & Vengeance UI motion primitives.
 *
 * 1. ScrollReveal: Smooth GPU transform entrance (translateY + scale + opacity).
 * 2. Scroll3DPerspective: Scroll-driven 3D perspective rotation (Linear/Apple style)
 *    scrubbed smoothly via useScroll + useTransform.
 * 3. ScrollParallax: Smooth vertical depth drift tied to scroll progress.
 * 4. ScrollRevealGroup: Clean staggered children entrance.
 *
 * All animations use GPU-composited transform and opacity properties only.
 */

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

// Emil Kowalski Easing Tokens
const EASE_OUT = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ─── 1. SCROLL REVEAL (Transform + Opacity) ──────────────────────────────────
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  amount?: number;
  scale?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  duration = 0.5,
  amount = 0.1,
  scale = 0.98,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        transform: reduce ? "none" : `translateY(${distance}px) scale(${scale})`,
      }}
      whileInView={{
        opacity: 1,
        transform: "translateY(0px) scale(1)",
      }}
      viewport={{ once: true, amount, margin: "-40px 0px" }}
      transition={{
        duration: reduce ? 0.1 : duration,
        delay: reduce ? 0 : delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── 2. SCROLL 3D PERSPECTIVE (Linear/Apple scroll tilt) ─────────────────────
interface Scroll3DPerspectiveProps {
  children: React.ReactNode;
  className?: string;
  rotateXStart?: number;
  scaleStart?: number;
  translateYStart?: number;
}

export function Scroll3DPerspective({
  children,
  className,
  rotateXStart = 10,
  scaleStart = 0.94,
  translateYStart = 40,
}: Scroll3DPerspectiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Entrance [0 -> 0.35], Active Center [0.35 -> 0.65], Smooth Exit [0.65 -> 0.95]
  const rotateX = useTransform(smoothProgress, [0, 0.35, 0.65, 0.95], [rotateXStart, 0, 0, -6]);
  const scale = useTransform(smoothProgress, [0, 0.35, 0.65, 0.95], [scaleStart, 1, 1, 0.93]);
  const y = useTransform(smoothProgress, [0, 0.35, 0.65, 0.95], [translateYStart, 0, 0, -25]);
  const opacity = useTransform(smoothProgress, [0, 0.22, 0.72, 0.95], [0, 1, 1, 0]);

  if (reduce) {
    return <div ref={containerRef} className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{ perspective: "1200px" }}
      className={`relative ${className || ""}`}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          opacity,
          transformOrigin: "center top",
        }}
        className="w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── 3. SCROLL PARALLAX ──────────────────────────────────────────────────────
interface ScrollParallaxProps {
  children: React.ReactNode;
  className?: string;
  offsetY?: number;
}

export function ScrollParallax({
  children,
  className,
  offsetY = 60,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}

// ─── 4. SCROLL REVEAL GROUP (Auto Stagger) ───────────────────────────────────
interface ScrollRevealGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
  amount?: number;
}

export function ScrollRevealGroup({
  children,
  className,
  staggerMs = 60,
  amount = 0.08,
}: ScrollRevealGroupProps) {
  const reduce = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduce ? 0 : staggerMs / 1000,
        delayChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      transform: reduce ? "none" : "translateY(24px) scale(0.98)",
    },
    show: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      transition: {
        duration: reduce ? 0.1 : 0.45,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: "-40px 0px" }}
    >
      {React.Children.map(children, (child, i) =>
        child ? (
          <motion.div key={i} variants={item}>
            {child}
          </motion.div>
        ) : null,
      )}
    </motion.div>
  );
}
