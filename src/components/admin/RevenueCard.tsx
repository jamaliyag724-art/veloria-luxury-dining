import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/currency";

interface RevenueCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  subtitle?: string;
  loading?: boolean;
  isCurrency?: boolean;
  accentClass?: string;
  index?: number;
}

const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  loading = false,
  isCurrency = false,
  accentClass = "bg-primary/10 text-primary",
  index = 0,
}) => {

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-7 border border-border shadow-sm">

        <div className="flex justify-between mb-5">

          <Skeleton className="w-12 h-12 rounded-xl" />

          <Skeleton className="w-16 h-5 rounded-full" />

        </div>

        <Skeleton className="w-24 h-8 mb-2" />
        <Skeleton className="w-32 h-4" />

      </div>
    );
  }

  const displayValue = isCurrency ? formatPrice(value as number) : value;
  const isPositive = trend && trend > 0;

  return (

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="bg-card rounded-2xl p-7 border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >

      <div className="flex justify-between mb-5">

        <div className={`p-3 rounded-xl ${accentClass}`}>
          <Icon className="w-5 h-5" />
        </div>

        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >

            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}

            {isPositive ? "+" : ""}
            {trend}%

          </span>
        )}

      </div>

      <h3 className="text-2xl font-serif font-semibold text-foreground">
        {displayValue}
      </h3>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      {subtitle && (
        <p className="text-xs text-primary mt-1">
          {subtitle}
        </p>
      )}

    </motion.div>
  );
};

export default RevenueCard;
