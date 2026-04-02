import { motion } from "framer-motion";
import StarIcon from "./StarIcon";

const EXPERIENCES = [
  {
    year: "03/2023 — 03/2026",
    role: "Senior Full Stack Developer",
    company: "EPAM Systems",
    location: "Remote",
    highlights: [
      "Architected and led development of a SaaS customer portal used by 75,000+ monthly active users, reducing churn by 42% and improving page load speed by 65%.",
      "Mentored a remote team of 4 developers across Poland, Germany, and the US; introduced automated testing and CI/CD pipelines that shortened release cycles from 3 weeks to 5 days.",
      "Collaborated directly with product stakeholders in English to translate business requirements into technical solutions, consistently delivering features ahead of schedule.",
    ],
  },
  {
    year: "2019 — 2023",
    role: "Full Stack Developer",
    company: "Accenture",
    location: "Remote",
    highlights: [
      "Built and optimized GraphQL APIs that reduced over-fetching by 70%, significantly improving frontend performance and developer productivity.",
      "Led migration of legacy monolithic systems to containerized microservices using Docker and Kubernetes, decreasing deployment time by 80%.",
      "Implemented real-time features with WebSockets and Redis, enabling live dashboards that increased client decision-making speed by 35%.",
    ],
  },
  {
    year: "2015 — 2019",
    role: "Junior Full Stack Developer",
    company: "Capgemini",
    location: "Kozy, Poland",
    highlights: [
      "Contributed to full-stack development of internal business tools using Vue.js, Express.js, and MongoDB, supporting 20 enterprise clients across Europe.",
      "Implemented CI/CD pipelines with GitHub Actions that automated testing and deployments, reducing manual effort by 75% and eliminating production bugs caused by human error.",
      "Optimized database queries and frontend rendering, achieving a 50% improvement in application performance metrics.",
      "Participated in code refactoring initiatives that modernized legacy codebases, preparing systems for future scalability.",
    ],
  },
];

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarIcon size={16} className="animate-twinkle" />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gold-gradient star-text-shadow">
              Experience
            </h2>
            <StarIcon size={16} className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
          </div>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`relative flex items-start mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Star node */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  whileInView={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 -m-2 rounded-full animate-pulse-glow"
                      style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)", width: 32, height: 32, transform: "translate(-25%, -25%)" }}
                    />
                    <StarIcon size={20} />
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className={`ml-16 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="p-5 rounded-xl border-gold-glow bg-card/50 backdrop-blur-sm text-left">
                  <span className="font-accent text-xs tracking-widest uppercase text-primary">
                    {exp.year}
                  </span>
                  <h3 className="font-display text-lg font-bold text-gold-gradient mt-1">
                    {exp.role}
                  </h3>
                  <p className="font-accent text-sm text-muted-foreground mb-2">{exp.company}</p>
                  <ul className="text-muted-foreground text-sm font-body leading-relaxed list-disc pl-5 space-y-1">
                    {exp.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="font-accent text-xs text-muted-foreground mt-3 uppercase tracking-wider">
                    {exp.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
