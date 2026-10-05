import { track } from "@/lib/analytics";

/**
 * CTA button with a looping gradient border that shines and glows,
 * accelerating on hover. Styles live in index.css (.hp-neon-btn).
 */
const NeonButton = ({ children, href, onClick, type = "button", testId, trackLabel, className = "", disabled = false }) => {
  const inner = (
    <span className="flex items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white">
      {children}
    </span>
  );

  const handleClick = (e) => {
    if (trackLabel) track("cta_click", { label: trackLabel });
    if (onClick) onClick(e);
  };

  if (href) {
    return (
      <a
        href={href}
        data-testid={testId}
        onClick={handleClick}
        className={`hp-neon-btn inline-block ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      data-testid={testId}
      onClick={handleClick}
      disabled={disabled}
      className={`hp-neon-btn inline-block disabled:opacity-60 ${className}`}
    >
      {inner}
    </button>
  );
};

export default NeonButton;
