import { IBM_Plex_Sans } from "next/font/google";
import { type ReactNode } from "react";

const fontDisplay = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export default function SuzukiCapsuleButton({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      className={`${fontDisplay.className} group relative inline-flex items-center overflow-visible rounded-full border-0 bg-transparent p-0 font-medium uppercase tracking-[0.14em] text-white ${
        isSm ? "h-8" : "h-11"
      } ${className}`}
    >
      <span
        className={`absolute top-0 rounded-full bg-[#25282b] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSm
            ? "left-8 right-0 h-8 group-hover:left-0 group-hover:right-8"
            : "left-11 right-0 h-11 group-hover:left-0 group-hover:right-11"
        }`}
        aria-hidden
      />

      <span
        className={`absolute left-0 top-0 z-20 flex items-center justify-center rounded-full bg-[#f0743e] text-[#25282b] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSm
            ? "h-8 w-8 group-hover:left-[calc(100%-2rem)]"
            : "h-11 w-11 group-hover:left-[calc(100%-2.75rem)]"
        }`}
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className={isSm ? "h-3.5 w-3.5" : "h-4.5 w-4.5"}
          fill="currentColor"
        >
          <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
        </svg>
      </span>

      <span
        className={`relative z-10 whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSm
            ? "ml-8 px-5 text-[0.62rem] group-hover:ml-0 group-hover:mr-8"
            : "ml-11 px-8 text-[0.72rem] group-hover:ml-0 group-hover:mr-11"
        }`}
      >
        {children}
      </span>
    </button>
  );
}