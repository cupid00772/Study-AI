/**
 * Renders inline text with an organic hand-drawn graphite pencil strike-through SVG
 * that animates smoothly from left to right when `active` becomes true.
 */
export default function PencilStrikeText({
  children,
  active = false,
  instant = false,
  strokeColor = 'currentColor',
  className = '',
  style,
}) {
  return (
    <span
      className={`pencil-strike-wrap ${active ? 'is-struck' : ''} ${instant ? 'is-instant' : ''} ${className}`.trim()}
      style={style}
    >
      <span className="pencil-strike-label">{children}</span>
      <svg
        className="pencil-strike-svg"
        viewBox="0 0 220 18"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Main organic hand-drawn pencil stroke */}
        <path
          className="pencil-strike-path primary"
          d="M 2 10.5 C 42 7.8, 86 12.2, 132 8.8 C 166 6.8, 194 10.6, 218 8.4"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        {/* Subtle secondary graphite texture stroke */}
        <path
          className="pencil-strike-path texture"
          d="M 5 11.4 C 52 9.4, 102 12.8, 154 9.5 C 180 8.2, 202 10.8, 215 9.2"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.05"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}

