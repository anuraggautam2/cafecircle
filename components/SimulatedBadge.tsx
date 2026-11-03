import React from 'react';

interface SimulatedBadgeProps {
  className?: string;
  variant?: 'banner' | 'pill';
}

export default function SimulatedBadge({ className = '', variant = 'pill' }: SimulatedBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`bg-[#F5F2EB] border-b border-[#EAE6DE] px-4 py-1.5 text-[11px] text-[#6E685F] ${className}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B84A22]"></span>
            <span>Simulated Prototype • Demonstration mode for community cafe funding</span>
          </div>
          <a href="/legal/risk-disclosure" className="text-[#181514] hover:underline font-medium hidden sm:inline">
            Risk Notice &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#6E685F] bg-[#F5F2EB] border border-[#EAE6DE] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#B84A22]"></span>
      Sandbox
    </span>
  );
}
