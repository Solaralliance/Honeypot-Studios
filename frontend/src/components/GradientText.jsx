/**
 * Gradient text with a trailing nbsp — extends the text run's box so
 * Chromium's bg-clip:text mask never clips the final glyph's ink
 * (Unbounded quirk, verified in-browser). Use instead of raw
 * className="hp-gradient-text".
 */
const GradientText = ({ children, className = "" }) => (
  <span className={`hp-gradient-text ${className}`}>
    {children}
    {" "}
  </span>
);

export default GradientText;
