"use client";

import { ChevronDown } from "lucide-react";

interface SortBarProps {
  resultCount: number;
}

export function SortBar({ resultCount }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 pt-2">
      <span className="text-sm font-medium text-gray-500">
        Mostrando {resultCount} resultados
      </span>

      <button className="group flex items-center gap-2 text-sm font-semibold cursor-pointer hover:text-brand-pink transition-colors">
        Ordenar por
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
    </div>
  )
}
