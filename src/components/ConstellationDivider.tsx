import { motion } from "framer-motion";

const ConstellationDivider = () => {
  const points = Array.from({ length: 7 }, (_, i) => ({
    x: 10 + i * 14 + (Math.random() - 0.5) * 6,
    y: 50 + (Math.random() - 0.5) * 30,
  }));

  return (
    <div className="py-8 flex justify-center">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-8">
        {points.slice(0, -1).map((p, i) => (
          <motion.line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={points[i + 1].x}
            y2={points[i + 1].y}
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          />
        ))}
        {points.map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r="1"
            fill="hsl(var(--primary) / 0.6)"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            viewport={{ once: true }}
          />
        ))}
      </svg>
    </div>
  );
};

export default ConstellationDivider;
