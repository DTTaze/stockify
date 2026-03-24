"use client";

import { TrendingUp } from "lucide-react";

type StatItem = {
  value: string;
  label: string;
};

type LeftPanelProps = {
  brandName?: string;
  title?: React.ReactNode;
  description?: string;
  stats?: StatItem[];
};

export default function LeftPanel(props: LeftPanelProps) {
  const { brandName, title, description, stats } = props;
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d4af37] blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex items-center space-x-3">
          <TrendingUp className="h-10 w-10 text-[#d4af37]" />
          <span className="text-3xl font-light text-white">{brandName}</span>
        </div>

        <h1 className="mb-6 text-5xl leading-tight text-white">{title}</h1>

        <p className="text-xl leading-relaxed text-blue-100">{description}</p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-8 text-white">
        {stats?.map((item, index) => (
          <div key={index}>
            <div className="mb-2 text-3xl text-[#d4af37]">{item.value}</div>
            <div className="text-sm text-blue-100">{item.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
