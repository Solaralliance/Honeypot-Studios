import { motion } from "framer-motion";

/**
 * Scroll-triggered heading reveal — headings drop down into place
 * when the user scrolls to them.
 */
const Reveal = ({ children, className = "", delay = 0, as = "div", testId }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      data-testid={testId}
      className={className}
      initial={{ opacity: 0, y: -28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
