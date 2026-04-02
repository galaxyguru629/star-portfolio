import { lazy, Suspense } from "react";
import StarfieldBackground from "@/components/StarfieldBackground";
import StarCursor from "@/components/StarCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsConstellation from "@/components/SkillsConstellation";
import ConstellationDivider from "@/components/ConstellationDivider";
import StarIcon from "@/components/StarIcon";

const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const ExperienceTimeline = lazy(() => import("@/components/ExperienceTimeline"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

interface IndexProps {
  theme: "gold" | "crystal";
  onToggleTheme: () => void;
}

const Index = ({ theme, onToggleTheme }: IndexProps) => {
  return (
    <div className="relative min-h-screen">
      <StarfieldBackground />
      <StarCursor />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="relative z-10">
        <HeroSection />
        <ConstellationDivider />
        <SkillsConstellation />
        <ConstellationDivider />
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <ProjectsSection />
          <ConstellationDivider />
          <ExperienceTimeline />
          <ConstellationDivider />
          <ContactSection />
        </Suspense>

        {/* Footer */}
        <footer className="py-12 text-center border-t border-border/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <StarIcon size={14} className="animate-twinkle" />
            <span className="font-display text-xs tracking-widest text-gold-gradient uppercase">
              Crafted by Adam Kowalski
            </span>
            <StarIcon size={14} className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-muted-foreground text-xs font-body">
            © {new Date().getFullYear()} Adam Kowalski — All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
