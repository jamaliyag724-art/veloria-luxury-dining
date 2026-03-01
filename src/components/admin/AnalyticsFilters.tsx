import React from "react";

interface AnalyticsFiltersProps {
  dateRange: string;
  onChange: (range: string) => void;
}

const filters = [
  { id: "today", label: "Today" },
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "all", label: "All Time" },
];

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${
            dateRange === f.id
              ? "bg-primary text-primary-foreground shadow-gold"
              : "bg-white border border-border hover:bg-secondary"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default AnalyticsFilters;
