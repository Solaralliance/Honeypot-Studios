import { motion } from "framer-motion";

/**
 * Card with a stationary neon gradient border; a shine sweeps the border
 * on hover. Styles live in index.css (.hp-shimmer-card).
 */
const ShimmerCard = ({ children, className = "", testId, as = "div" }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      data-testid={testId}
      className={`hp-shimmer-card ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
};

export default ShimmerCard;
