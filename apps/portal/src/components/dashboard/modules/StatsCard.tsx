"use client";

interface Props {
  title: string;
  value: string;
  color: string;
}

export default function StatsCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-[#081223]
        p-6
        transition-all
        duration-300
        hover:border-slate-600
        hover:-translate-y-1
      "
    >
      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div
        className="mt-3 text-3xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
