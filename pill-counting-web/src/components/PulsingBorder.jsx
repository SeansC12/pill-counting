import { cn } from "@/lib/utils";

export default function PulsingBorder({
  isError,
  children,
}) {
  return (
    <div className="relative">
      {isError && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="absolute inset-0 animate-pulse-gradient bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
            style={{
              backgroundSize: "200% 200%",
              filter: "blur(8px)",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
