import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: number;
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  className,
  delay = 0,
}: MetricCardProps) {
  const animationClass = delay ? `animate-[fade-in_0.4s_ease-out_${delay}s_both]` : "animate-fade-in";
  
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-subtle overflow-hidden relative card-hover",
        animationClass,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            {trend !== undefined && (
              <span className={`text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-full p-2.5 bg-primary/10", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      {/* Background decorative element */}
      <div
        className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-primary/5 dark:bg-primary/10 blur-xl animate-pulse-subtle"
        style={{ animationDelay: `${delay + 0.5}s` }}
      />
    </div>
  );
}