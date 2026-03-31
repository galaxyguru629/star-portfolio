import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import StarIcon from "./StarIcon";

const PROJECTS = [
  {
    title: "SaaS Customer Portal",
    description:
      "Architected and delivered a high-traffic customer portal serving 75,000+ monthly active users, with a strong focus on performance, usability, and scalable frontend architecture.",
    tags: ["React", "TypeScript", "GraphQL", "CI/CD"],
    stars: 5,
    icon: "🚀",
  },
  {
    title: "GraphQL Platform Modernization",
    description:
      "Designed and optimized GraphQL APIs to reduce over-fetching by 70%, improving frontend responsiveness and accelerating delivery for cross-functional teams.",
    tags: ["Node.js", "GraphQL", "Redis", "Performance"],
    stars: 5,
    icon: "⚙️",
  },
  {
    title: "Microservices Migration Program",
    description:
      "Led migration from monolithic services to Docker and Kubernetes-based microservices, reducing deployment time by 80% and improving release reliability.",
    tags: ["Docker", "Kubernetes", "Node.js", "DevOps"],
    stars: 5,
    icon: "🧩",
  },
  {
    title: "Real-Time Operations Dashboard",
    description:
      "Implemented live data features with WebSockets and Redis, enabling real-time dashboards that increased decision-making speed by 35% for business users.",
    tags: ["WebSockets", "Redis", "React", "Realtime"],
    stars: 4,
    icon: "📈",
  },
];

const ProjectCard = ({ project, index }: { project: typeof PROJECTS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.7, type: "spring", stiffness: 100 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative"
      data-interactive
    >
      {/* Animated border glow */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.45), transparent 40%, transparent 60%, hsl(var(--primary) / 0.45))",
        }}
      />

      <div className="relative p-7 md:p-9 rounded-2xl bg-card/40 backdrop-blur-md border border-primary/10 group-hover:border-primary/30 transition-all duration-500 overflow-hidden">
        
        {/* Background glow orb */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
        />

        {/* Corner stars - all 4 corners */}
        {[
          { pos: "top-3 right-3", size: 14, dur: 3, rot: [0, 15, -15, 0], scale: [0.7, 1.3, 0.7] },
          { pos: "bottom-3 left-3", size: 11, dur: 4, rot: [0, -20, 20, 0], scale: [0.5, 1, 0.5] },
          { pos: "top-3 left-3", size: 9, dur: 3.5, rot: [0, 10, -10, 0], scale: [0.4, 0.9, 0.4] },
          { pos: "bottom-3 right-3", size: 10, dur: 3.2, rot: [0, 25, -10, 0], scale: [0.4, 1.1, 0.4] },
        ].map((star, j) => (
          <motion.div
            key={j}
            className={`absolute ${star.pos}`}
            animate={{
              rotate: star.rot,
              scale: star.scale,
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ duration: star.dur, repeat: Infinity, delay: index * 0.3 + j * 0.4 }}
          >
            <StarIcon size={star.size} />
          </motion.div>
        ))}

        {/* Floating sparkle particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(5)].map((_, j) => (
            <motion.div
              key={j}
              className="absolute opacity-0 group-hover:opacity-100"
              style={{
                left: `${10 + j * 20}%`,
                top: `${20 + (j % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, (j % 2 ? 10 : -10), 0],
                opacity: [0, 0.7, 0],
                scale: [0.3, 1, 0.3],
              }}
              transition={{ duration: 2.5 + j * 0.3, repeat: Infinity, delay: j * 0.5 }}
            >
              <StarIcon size={5 + (j % 3)} />
            </motion.div>
          ))}
        </div>

        {/* Star rating with staggered entrance */}
        <div className="flex gap-1.5 mb-5">
          {[...Array(5)].map((_, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: j < project.stars ? 1 : 0.15, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + j * 0.08, type: "spring", stiffness: 300, damping: 15 }}
              viewport={{ once: true }}
            >
              <StarIcon
                size={16}
                className={j < project.stars ? "animate-twinkle" : ""}
                style={{ animationDelay: `${j * 0.12}s` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Title with icon */}
        <div className="flex items-start gap-3 mb-3">
          <motion.span
            className="text-2xl mt-0.5"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
          >
            {project.icon}
          </motion.span>
          <h3 className="font-display text-xl md:text-2xl font-bold text-gold-gradient leading-tight">
            {project.title}
          </h3>
        </div>

        <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 pl-0">
          {project.description}
        </p>

        {/* Tags with hover glow */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, j) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + j * 0.05 }}
              viewport={{ once: true }}
              className="px-3 py-1.5 text-xs font-accent tracking-wider uppercase rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/15 hover:border-primary/40 transition-all duration-300 cursor-default"
              data-interactive
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Bottom shimmer line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.55), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <StarIcon size={20} className="animate-twinkle" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gold-gradient star-text-shadow">
              Selected Projects
            </h2>
            <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <StarIcon size={20} className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
            </motion.div>
          </div>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-base">
            Enterprise products and platforms delivered with measurable business impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
