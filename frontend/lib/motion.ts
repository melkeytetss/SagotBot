// Emil Kowalski Motion Physics & Easing Constants
// All animations must use transform + opacity only (GPU-composited).
// Never use ease-in on UI. Reduced motion handled at component level via useReducedMotion().

export const EASING = {
  // Strong ease-out for entering UI elements (starts fast, feels responsive)
  out: [0.23, 1, 0.32, 1] as const,
  // Strong ease-in-out for elements moving or morphing on screen
  inOut: [0.77, 0, 0.175, 1] as const,
  // iOS drawer curve with smooth momentum deceleration
  drawer: [0.32, 0.72, 0, 1] as const,
};

export const SPRINGS = {
  // Snappy spring for button feedback & small toggles
  snappy: { type: "spring", stiffness: 350, damping: 25 },
  // Smooth spring for cursor-tracking characters and floating eyes
  organic: { type: "spring", stiffness: 120, damping: 14, mass: 0.8 },
  // Bouncy spring for celebrations and badge pop-ins
  bouncy: { type: "spring", stiffness: 260, damping: 15, mass: 0.6 },
  // Gentle spring for card layouts and page elements
  gentle: { type: "spring", stiffness: 100, damping: 12 },
};

export const TRANSITION_FAST = {
  duration: 0.18,
  ease: EASING.out,
};

export const TRANSITION_NORMAL = {
  duration: 0.25,
  ease: EASING.out,
};

// Joyful multi-keyframe bounce transition (avoids Framer Motion >2 keyframe spring restrictions)
export const TRANSITION_KEYFRAME_BOUNCE = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Scroll-triggered viewport defaults — margin fires 80px before element is in view
// so it doesn't feel like things pop in only AFTER you've scrolled past them.
export const VIEWPORT_DEFAULTS = {
  once: true,
  amount: 0.05,
  margin: "-80px 0px",
} as const;

// Standard section reveal: fade + lift, GPU-only, strong ease-out
export const SECTION_REVEAL = {
  initial: { opacity: 0, transform: "translateY(28px)" },
  whileInView: { opacity: 1, transform: "translateY(0px)" },
  viewport: VIEWPORT_DEFAULTS,
  transition: { duration: 0.48, ease: EASING.out },
} as const;
