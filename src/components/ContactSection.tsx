import { motion } from "framer-motion";
import { useState } from "react";
import StarIcon from "./StarIcon";

const ContactSection = () => {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <section id="contact" className="relative py-24 px-4">
      <div className="max-w-2xl mx-auto">
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
              Get in Touch
            </h2>
            <StarIcon size={16} className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-muted-foreground font-body">
            Have a project in mind? Let's build something great together.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {[
            { name: "name", label: "Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="block font-accent text-xs tracking-widest uppercase text-muted-foreground mb-2">
                {field.label}
              </label>
              <div className={`relative transition-all duration-500 ${focused === field.name ? "glow-gold" : ""} rounded-lg`}>
                <input
                  type={field.type}
                  data-interactive
                  className="w-full px-5 py-3 rounded-lg bg-secondary/50 border border-border font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                  placeholder={`Your ${field.label.toLowerCase()}`}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>
          ))}

          <div className="relative">
            <label className="block font-accent text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Message
            </label>
            <div className={`relative transition-all duration-500 ${focused === "message" ? "glow-gold" : ""} rounded-lg`}>
              <textarea
                rows={5}
                data-interactive
                className="w-full px-5 py-3 rounded-lg bg-secondary/50 border border-border font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors duration-300 resize-none"
                placeholder="Tell Adam about your project..."
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            data-interactive
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group py-4 px-8 font-display text-sm tracking-widest uppercase rounded-lg border-gold-glow bg-primary/10 transition-all duration-500 hover:bg-primary/20"
          >
            <span className="text-gold-gradient">Send Message</span>
            <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <StarIcon size={12} className="animate-twinkle" />
            </div>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
