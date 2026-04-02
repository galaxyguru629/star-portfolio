import { motion } from "framer-motion";
import StarIcon from "./StarIcon";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Giant pulsing star behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="relative">
            <div
              className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full animate-pulse-glow"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary) / 0.14) 0%, hsl(var(--primary) / 0.04) 40%, transparent 70%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <StarIcon size={120} className="animate-pulse-glow opacity-20" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Sparkle accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex justify-center gap-3 mb-6"
        >
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => {
              const total = 5
              const center = Math.floor(total / 2)

              // ⭐ symmetric size: 16, 18, 20, 18, 16
              const size = 20 - Math.abs(i - center) * 2

              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.8 + i * 0.1,
                    type: "spring",
                    stiffness: 120,
                  }}
                  className="flex items-center justify-center"
                >
                  <StarIcon
                    size={size}
                    className="animate-twinkle"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      filter: "none",
                    }}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-accent text-sm md:text-base tracking-[0.4em] uppercase text-gold-muted mb-4"
          style={{ color: "hsl(var(--gold-muted))" }}
        >
          Welcome to my universe
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-gold-gradient star-text-shadow leading-tight mb-6"
        >
          Adam
          <br />
          Kowalski
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body"
        >
          Software Developer building modern web experiences with performance, clarity, and strong engineering foundations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            data-interactive
            className="group relative px-8 py-4 font-display text-sm tracking-widest uppercase border-gold-glow rounded-lg bg-secondary/50 backdrop-blur-sm transition-all duration-500 hover:bg-primary/10"
          >
            <span className="text-gold-gradient">View Projects</span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-gold" />
          </a>
          <a
            href="#contact"
            data-interactive
            className="group relative px-8 py-4 font-display text-sm tracking-widest uppercase bg-primary/10 border border-primary/40 rounded-lg transition-all duration-500 hover:bg-primary/20"
          >
            <span className="text-gold-gradient">Get in Touch</span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-gold-strong" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float"
      >
        <div className="flex flex-col items-center gap-2">
          <StarIcon size={8} className="animate-twinkle" />
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
