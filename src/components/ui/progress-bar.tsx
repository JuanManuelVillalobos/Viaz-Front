import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  missing: number; // Number of missing fields
  className?: string;
  showText?: boolean;
}

export const ProgressBar = ({
  progress,
  missing,
  className,
  showText = true,
}: ProgressBarProps) => {
  // Color based on progress
  const getBarColor = () => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-in-out",
            getBarColor()
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% complete</span>
          <span>{missing} missing</span>
        </div>
      )}
    </div>
  );
};