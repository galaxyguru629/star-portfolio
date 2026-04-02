import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StarIcon from "./StarIcon";

const NAV_LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  theme: "gold" | "crystal";
  onToggleTheme: () => void;
}

const Navbar = ({ theme, onToggleTheme }: NavbarProps) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -30% 0px", threshold: 0.1 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/30 border-b border-border/30"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" data-interactive className="flex items-center gap-2 group">
          <StarIcon size={20} className="group-hover:animate-pulse-glow transition-all duration-300" />
          <span className="font-display text-sm font-bold tracking-widest text-gold-gradient">
            ADAM KOWALSKI
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                data-interactive
                className={`relative px-4 py-2 font-accent text-sm tracking-wider uppercase transition-all duration-300 rounded-full ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/5"
                    style={{
                      boxShadow: "0 0 12px hsl(var(--primary) / 0.18), inset 0 0 12px hsl(var(--primary) / 0.06)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <StarIcon size={10} className="animate-twinkle" />
                    </motion.span>
                  )}
                  {link.label}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.05 }}
                    >
                      <StarIcon size={10} className="animate-twinkle" style={{ animationDelay: "0.3s" }} />
                    </motion.span>
                  )}
                </span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          data-interactive
          className="ml-3 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all duration-300 font-accent text-xs tracking-widest uppercase text-primary"
          aria-label="Toggle portfolio theme"
        >
          {theme === "gold" ? "Blue Theme" : "Gold Theme"}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
