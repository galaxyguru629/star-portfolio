import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import StarIcon from "./StarIcon";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  group: "frontend" | "backend" | "devops" | "design" | "tools";
}

interface Connection {
  from: string;
  to: string;
}

const GROUP_COLORS: Record<string, string> = {
  frontend: "hsl(var(--primary))",
  backend: "hsl(200, 80%, 60%)",
  devops: "hsl(150, 70%, 50%)",
  design: "hsl(320, 70%, 60%)",
  tools: "hsl(30, 90%, 55%)",
};

const GROUP_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  design: "Design",
  tools: "Tools",
};

const SKILLS: SkillNode[] = [
  { id: "react", label: "React", x: 25, y: 22, level: 95, group: "frontend" },
  { id: "ts", label: "TypeScript", x: 42, y: 12, level: 90, group: "frontend" },
  { id: "next", label: "Next.js", x: 15, y: 42, level: 88, group: "frontend" },
  { id: "tailwind", label: "Tailwind", x: 35, y: 35, level: 92, group: "frontend" },
  { id: "vue", label: "Vue.js", x: 9, y: 28, level: 82, group: "frontend" },
  { id: "node", label: "Node.js", x: 60, y: 25, level: 85, group: "backend" },
  { id: "python", label: "Python", x: 75, y: 15, level: 80, group: "backend" },
  { id: "postgres", label: "PostgreSQL", x: 70, y: 45, level: 82, group: "backend" },
  { id: "mongodb", label: "MongoDB", x: 84, y: 37, level: 78, group: "backend" },
  { id: "express", label: "Express", x: 64, y: 36, level: 84, group: "backend" },
  { id: "docker", label: "Docker", x: 55, y: 58, level: 78, group: "devops" },
  { id: "aws", label: "AWS", x: 78, y: 62, level: 75, group: "devops" },
  { id: "k8s", label: "Kubernetes", x: 66, y: 62, level: 79, group: "devops" },
  { id: "github-actions", label: "GitHub Actions", x: 47, y: 64, level: 86, group: "devops" },
  { id: "git", label: "Git", x: 42, y: 52, level: 90, group: "tools" },
  { id: "graphql", label: "GraphQL", x: 52, y: 40, level: 83, group: "backend" },
  { id: "redis", label: "Redis", x: 58, y: 46, level: 80, group: "backend" },
  { id: "websocket", label: "WebSockets", x: 49, y: 30, level: 79, group: "backend" },
  { id: "jest", label: "Jest", x: 31, y: 57, level: 83, group: "tools" },
  { id: "playwright", label: "Playwright", x: 36, y: 66, level: 78, group: "tools" },
  { id: "figma", label: "Figma", x: 22, y: 62, level: 70, group: "design" },
];

const CONNECTIONS: Connection[] = [
  { from: "react", to: "ts" },
  { from: "react", to: "next" },
  { from: "react", to: "tailwind" },
  { from: "ts", to: "node" },
  { from: "node", to: "postgres" },
  { from: "node", to: "graphql" },
  { from: "docker", to: "aws" },
  { from: "docker", to: "node" },
  { from: "git", to: "docker" },
  { from: "tailwind", to: "figma" },
  { from: "python", to: "node" },
  { from: "graphql", to: "postgres" },
  { from: "git", to: "tailwind" },
  { from: "vue", to: "tailwind" },
  { from: "node", to: "express" },
  { from: "express", to: "mongodb" },
  { from: "graphql", to: "redis" },
  { from: "websocket", to: "redis" },
  { from: "websocket", to: "node" },
  { from: "docker", to: "k8s" },
  { from: "github-actions", to: "docker" },
  { from: "git", to: "github-actions" },
  { from: "jest", to: "react" },
  { from: "playwright", to: "react" },
  { from: "playwright", to: "github-actions" },
  { from: "k8s", to: "aws" },
];

const SkillsConstellation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const connectedSkills = useMemo(() => {
    if (!hovered) return new Set<string>();
    const set = new Set<string>();
    set.add(hovered);
    CONNECTIONS.forEach((c) => {
      if (c.from === hovered) set.add(c.to);
      if (c.to === hovered) set.add(c.from);
    });
    return set;
  }, [hovered]);

  const filteredSkills = activeGroup
    ? SKILLS.filter((s) => s.group === activeGroup)
    : SKILLS;

  const groups = [...new Set(SKILLS.map((s) => s.group))];

  return (
    <section id="skills" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarIcon size={16} className="animate-twinkle" />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gold-gradient star-text-shadow">
              Skills Constellation
            </h2>
            <StarIcon size={16} className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-6">
            Hover over stars to explore connections between technologies
          </p>

          {/* Group filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              onClick={() => setActiveGroup(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-accent tracking-wider uppercase transition-all duration-300 border ${
                !activeGroup
                  ? "border-primary bg-primary/20 text-primary glow-gold"
                  : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              All
            </button>
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(activeGroup === g ? null : g)}
                className={`px-4 py-1.5 rounded-full text-xs font-accent tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 ${
                  activeGroup === g
                    ? "border-primary bg-primary/20 text-primary glow-gold"
                    : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: GROUP_COLORS[g] }}
                />
                {GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Constellation map */}
        <div ref={ref} className="relative w-full aspect-[16/9] max-h-[500px] mb-10">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 75" preserveAspectRatio="none">
            {isInView &&
              CONNECTIONS.map((conn, i) => {
                const from = SKILLS.find((s) => s.id === conn.from)!;
                const to = SKILLS.find((s) => s.id === conn.to)!;
                const isActive =
                  hovered && connectedSkills.has(conn.from) && connectedSkills.has(conn.to);
                const isGrouped =
                  activeGroup && from.group === activeGroup && to.group === activeGroup;
                const dimmed = activeGroup && (!filteredSkills.find(s => s.id === conn.from) || !filteredSkills.find(s => s.id === conn.to));

                return (
                  <motion.line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={
                      isActive
                        ? "hsl(var(--primary) / 0.75)"
                        : isGrouped
                        ? "hsl(var(--primary) / 0.35)"
                        : dimmed
                        ? "hsl(var(--primary) / 0.04)"
                        : "hsl(var(--primary) / 0.14)"
                    }
                    strokeWidth={isActive ? 0.4 : 0.15}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: i * 0.04 }}
                  />
                );
              })}
          </svg>

          {SKILLS.map((skill, i) => {
            const isActive = hovered ? connectedSkills.has(skill.id) : false;
            const isHovered = hovered === skill.id;
            const isDimmed = activeGroup && skill.group !== activeGroup;
            const starSize = 10 + (skill.level / 100) * 14;
            const floatDuration = 4.8 + (i % 5) * 0.8;
            const floatDelay = (i % 7) * 0.35;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: isDimmed ? 0.15 : 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.06, type: "spring", stiffness: 200 }}
                className="absolute group"
                style={{
                  left: `${skill.x}%`,
                  top: `${skill.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHovered(skill.id)}
                onMouseLeave={() => setHovered(null)}
                data-interactive
              >
                <motion.div
                  animate={isInView ? { y: [0, -4, 0, 3, 0], x: [0, 1.5, 0, -1.5, 0] } : {}}
                  transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: "easeInOut" }}
                >
                <div
                  className={`relative transition-all duration-300 ${
                    isHovered ? "scale-[1.6]" : isActive ? "scale-125" : ""
                  }`}
                >
                  <motion.div
                    className="absolute left-1/2 top-1/2 rounded-full border pointer-events-none"
                    style={{
                      width: starSize * 2.2,
                      height: starSize * 2.2,
                      transform: "translate(-50%, -50%)",
                      borderColor: `${GROUP_COLORS[skill.group]}30`,
                    }}
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 2.4 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {(isHovered || isActive) && (
                    <div
                      className="absolute animate-pulse-glow rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${GROUP_COLORS[skill.group]}33 0%, transparent 70%)`,
                        width: starSize * 5,
                        height: starSize * 5,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                  <StarIcon
                    size={starSize}
                    color={GROUP_COLORS[skill.group]}
                    className={`transition-all duration-300 drop-shadow-[0_0_6px_${GROUP_COLORS[skill.group]}] ${
                      isActive || !hovered ? "" : "opacity-30"
                    }`}
                  />
                </div>
                </motion.div>

                {/* Always-visible label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap transition-all duration-300 ${
                    isHovered ? "opacity-100 scale-110" : "opacity-70"
                  }`}
                >
                  <span className="font-accent text-[10px] tracking-wider uppercase text-foreground/80 block text-center">
                    {skill.label}
                  </span>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-accent text-[10px] tracking-wider text-primary block text-center"
                    >
                      {skill.level}%
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skills grid summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {SKILLS.sort((a, b) => b.level - a.level).map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              onHoverStart={() => setHovered(skill.id)}
              onHoverEnd={() => setHovered(null)}
              className="relative p-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm text-center group overflow-hidden"
              data-interactive
            >
              {/* Animated star corner */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <StarIcon size={8} className="animate-twinkle" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"
                style={{ boxShadow: `inset 0 0 20px ${GROUP_COLORS[skill.group]}15, 0 0 10px ${GROUP_COLORS[skill.group]}10` }}
              />

              <StarIcon size={16} className="mx-auto mb-1.5" color={GROUP_COLORS[skill.group]} />
              <div className="font-accent text-xs tracking-wider uppercase text-foreground/90 mb-1">
                {skill.label}
              </div>

              {/* Star-based level indicator */}
              <div className="flex justify-center gap-0.5">
                {[...Array(5)].map((_, j) => {
                  const filled = j < Math.round(skill.level / 20);
                  return (
                    <StarIcon
                      key={j}
                      size={8}
                      color={filled ? GROUP_COLORS[skill.group] : "hsl(228, 15%, 20%)"}
                      className={filled ? "animate-twinkle" : "opacity-30"}
                      style={{ animationDelay: `${j * 0.15}s` }}
                    />
                  );
                })}
              </div>
              <div className="font-accent text-[10px] text-muted-foreground mt-1">{skill.level}%</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsConstellation;
