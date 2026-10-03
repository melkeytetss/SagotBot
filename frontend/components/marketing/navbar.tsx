"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Bot, PhoneCall, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Page sections in physical scroll order
const NAV_LINKS = [
  { name: "Demo",     href: "#live-demo" },
  { name: "Features", href: "#features"  },
  { name: "Pricing",  href: "#pricing"   },
  { name: "FAQ",      href: "#faq"       },
] as const;

function scrollToSection(id: string) {
  const targetId = id.replace("#", "");
  const el = document.getElementById(targetId);
  if (!el) return;
  const offset = 88;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Top Scroll Progress Line
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // ── Robust Scroll-Spy ───────────────────────────────────────────────────────
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (isManualScrolling.current) return;

      // At top of hero: no nav section is highlighted
      if (window.scrollY < 260) {
        setActiveSection("");
        return;
      }

      // If at bottom of page: highlight FAQ
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 70
      ) {
        setActiveSection("faq");
        return;
      }

      // Check current section from top
      const probePosition = window.scrollY + 200;
      let matched = "";
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= probePosition) {
          matched = sectionIds[i];
          break;
        }
      }
      setActiveSection(matched);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      setActiveSection(targetId);
      isManualScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 850);
      scrollToSection(href);
      setMobileOpen(false);
    },
    [],
  );

  return (
    <>
      {/* Scroll Progress Bar at the absolute top of viewport */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-600 origin-left z-50 pointer-events-none"
      />

      {/* Top dissolve gradient so scrolling text smoothly disappears before hitting top edge */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#f8f8f9] via-[#f8f8f9]/90 to-transparent pointer-events-none z-30" />

      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 py-4 pointer-events-none">
        <nav
          className={`pointer-events-auto w-full max-w-5xl rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-xs py-3 px-5"
              : "bg-white/70 backdrop-blur-md border border-zinc-200/60 py-3.5 px-6"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Bot className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-center">
                <span className="text-base font-semibold tracking-tight text-zinc-950">SagotBot</span>
                <span className="ml-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 hidden sm:inline-block">
                  Taglish Voice
                </span>
              </div>
            </Link>

            {/* Desktop nav — discrete item highlights */}
            <div className="hidden md:flex items-center gap-1 relative">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setHoveredNav(link.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 ${
                      isActive ? "text-zinc-950 font-semibold" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {/* Hover pill */}
                    {hoveredNav === link.name && !isActive && (
                      <motion.div
                        className="absolute inset-0 bg-zinc-100/70 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-zinc-100 rounded-lg -z-10 border border-zinc-200/70"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3.5 py-2 rounded-lg transition-colors duration-150 interactive-press"
              >
                Sign In
              </Link>
              <a
                href="#live-demo"
                onClick={(e) => handleNavClick(e, "#live-demo")}
                className="px-3.5 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 transition-colors duration-150 interactive-press"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>Test Live Call</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-zinc-600 hover:text-zinc-950 p-2 interactive-press"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="md:hidden overflow-hidden border-t border-zinc-200 mt-3 pt-3 flex flex-col gap-1"
              >
                {NAV_LINKS.map((link, i) => {
                  const sectionId = link.href.replace("#", "");
                  const isActive = activeSection === sectionId;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className={`px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "text-zinc-950 bg-zinc-100 font-semibold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                      }`}
                    >
                      {link.name}
                    </motion.a>
                  );
                })}
                <div className="flex gap-2 pt-2 mt-1 border-t border-zinc-200">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
