"use client";

import { LayoutList, LayoutGrid, ChevronDown } from "lucide-react";

interface SortBarProps {
  resultCount: number;
  mobileColumns?: 1 | 2;
  onMobileColumnsChange?: (cols: 1 | 2) => void;
}

export function SortBar({ resultCount, mobileColumns = 1, onMobileColumnsChange }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 pt-2">
      <span className="text-sm font-medium text-gray-500">
        {resultCount} resultado{resultCount !== 1 ? 's' : ''}
      </span>

      <div className="flex items-center gap-3">
        {/* Mobile column toggle — only visible on mobile */}
        {onMobileColumnsChange && (
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={() => onMobileColumnsChange(1)}
              title="1 coluna"
              className={`p-1.5 rounded-lg transition-colors ${
                mobileColumns === 1
                  ? "bg-brand-pink text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMobileColumnsChange(2)}
              title="2 colunas"
              className={`p-1.5 rounded-lg transition-colors ${
                mobileColumns === 2
                  ? "bg-brand-pink text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}

        <button className="group flex items-center gap-2 text-sm font-semibold cursor-pointer hover:text-brand-pink transition-colors">
          Ordenar
          <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </button>
      </div>
    </div>
  )
}
