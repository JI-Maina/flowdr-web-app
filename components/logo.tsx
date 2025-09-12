import { cn } from "@/lib/utils";

export const LogoIcon = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M3 12c3-4 7-4 10 0s7 4 10 0"
        stroke={uniColor ? "currentColor" : "url(#logo-gradient)"}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 140 30"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto text-foreground", className)}
      fill="none"
    >
      {/* Wave Symbol */}
      <path
        d="M5 15c3-4 7-4 10 0s7 4 10 0"
        stroke={uniColor ? "currentColor" : "url(#logo-gradient)"}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {/* Wordmark “Flowdr” */}
      <text
        x="30"
        y="20"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
      >
        Flowdr
      </text>
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="140"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto", className)}
      fill="none"
    >
      <path
        d="M5 15c3-4 7-4 10 0s7 4 10 0"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <text
        x="30"
        y="20"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="500"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        Flowdr
      </text>
    </svg>
  );
};
