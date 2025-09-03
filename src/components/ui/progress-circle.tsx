import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
}

export const ProgressCircle = ({
  progress,
  size = 40,
  strokeWidth = 4,
  className,
  showText = true,
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Color based on progress
  const getStrokeColor = () => {
    if (progress >= 80) return "hsl(var(--success))";
    if (progress >= 50) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};