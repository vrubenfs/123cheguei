"use client";

export function TruckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cargo body */}
      <rect x="1" y="6" width="34" height="28" rx="3" fill="white" />
      {/* Cargo door lines */}
      <line x1="18" y1="10" x2="18" y2="30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
      {/* Cargo horizontal lines */}
      <line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <line x1="6" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <line x1="6" y1="26" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      {/* Cab */}
      <path d="M35,16 L35,34 L56,34 L56,24 L47,14 L37,14 C35.9,14 35,14.9 35,16 Z" fill="white" />
      {/* Cab window */}
      <path d="M39,17 L39,26 L51,26 L45,17 Z" fill="currentColor" opacity="0.2" />
      {/* Bumper */}
      <rect x="54" y="28" width="8" height="6" rx="2" fill="white" opacity="0.8" />
      {/* Undercarriage */}
      <rect x="0" y="34" width="58" height="3" rx="1.5" fill="white" opacity="0.5" />
      {/* Front wheel */}
      <circle cx="46" cy="38" r="7.5" fill="currentColor" opacity="0.3" />
      <circle cx="46" cy="38" r="7.5" stroke="white" strokeWidth="3.5" fill="none" />
      <circle cx="46" cy="38" r="2.5" fill="white" />
      {/* Rear wheel */}
      <circle cx="15" cy="38" r="7.5" fill="currentColor" opacity="0.3" />
      <circle cx="15" cy="38" r="7.5" stroke="white" strokeWidth="3.5" fill="none" />
      <circle cx="15" cy="38" r="2.5" fill="white" />
      {/* Speed lines */}
      <line x1="-4" y1="18" x2="-10" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="-4" y1="24" x2="-12" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="-4" y1="30" x2="-8" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };
  const iconClasses = {
    sm: "w-6 h-4",
    md: "w-7 h-5",
    lg: "w-9 h-6",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-accent rounded-[12px] flex items-center justify-center text-accent shadow-sm shadow-accent/20`}
    >
      <TruckIcon className={iconClasses[size]} />
    </div>
  );
}

export function Logo({
  variant = "default",
}: {
  variant?: "default" | "white";
}) {
  const textColor = variant === "white" ? "text-white" : "text-primary";
  const subtextColor =
    variant === "white" ? "text-accent-light" : "text-accent";

  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size="md" />
      <div className="flex flex-col leading-none">
        <span
          className={`text-[1.15rem] sm:text-[1.3rem] font-black ${textColor} tracking-tight`}
        >
          123cheguei
        </span>
        <span
          className={`text-[0.55rem] sm:text-[0.6rem] font-bold tracking-[0.22em] ${subtextColor} uppercase mt-0.5`}
        >
          Transporte
        </span>
      </div>
    </div>
  );
}
