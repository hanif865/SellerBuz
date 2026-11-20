/**
 * SellerBuz brand assets.
 * The mark is redrawn as inline SVG so it stays crisp at every size and
 * never depends on a network request for the logo.
 */

export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SellerBuz logo"
    >
      {/* handle */}
      <path
        d="M35 36 V27 a15 15 0 0 1 30 0 v9"
        stroke="#F97316"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
      {/* bag body */}
      <path
        d="M24 30 H76 C84 30 90 36 90 44 V79 C90 87 84 93 76 93 H24 C16 93 10 87 10 79 V44 C10 36 16 30 24 30 Z"
        fill="#132A5C"
      />
      {/* S monogram */}
      <path
        d="M61 49 H47 C42.6 49 39 52.6 39 57 C39 61.4 42.6 65 47 65 H53 C57.4 65 61 68.6 61 73 C61 77.4 57.4 81 53 81 H39"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* growth bars */}
      <rect x="66" y="71" width="5" height="13" rx="1.5" fill="#15803D" />
      <rect x="73" y="64" width="5" height="20" rx="1.5" fill="#16A34A" />
      <rect x="80" y="56" width="5" height="28" rx="1.5" fill="#22C55E" />
      {/* orange growth swoosh + arrow */}
      <path
        d="M8 88 C 32 96 58 90 73 62 C 76 56 80 49 84 43"
        stroke="#F97316"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <polygon points="94,31 77,36 86,49" fill="#F97316" />
    </svg>
  );
}

export function BrandWordmark({
  size = "md",
  showTagline = true,
  inverted = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  inverted?: boolean;
}) {
  const wordSize =
    size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-base sm:text-lg" : "text-lg sm:text-[21px]";

  return (
    <span className="flex items-center gap-2 sm:gap-2.5 min-w-0">
      <LogoMark
        className={
          size === "lg" ? "w-12 h-12 sm:w-14 sm:h-14 shrink-0" : size === "sm" ? "w-8 h-8 shrink-0" : "w-9 h-9 sm:w-10 sm:h-10 shrink-0"
        }
      />
      <span className="flex flex-col min-w-0 leading-none">
        <span className={`font-display font-extrabold tracking-tight leading-none ${wordSize} truncate`}>
          <span className={inverted ? "text-white" : "text-brand-800"}>Seller</span>
          <span className="text-accent-500">Buz</span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 text-[8px] sm:text-[9px] font-bold tracking-[0.18em] uppercase truncate ${
              inverted ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Your Selling Machine
          </span>
        )}
      </span>
    </span>
  );
}
