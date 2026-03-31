import { CSSProperties } from "react";

interface StarIconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  color?: string;
}

const StarIcon = ({ size = 24, className = "", style, color }: StarIconProps) => {
  const fill = color || "url(#goldGradient)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--gold-light))" />
          <stop offset="50%" stopColor="hsl(var(--gold))" />
          <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
        </linearGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 2l2.928 6.472L22 9.528l-5.236 4.472L18.236 22 12 17.928 5.764 22l1.472-7.999L2 9.528l7.072-1.056z"
        fill={fill}
        filter="url(#starGlow)"
      />
    </svg>
  );
};

export default StarIcon;
