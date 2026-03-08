"use client";

import * as Slider from "@radix-ui/react-slider";
import { Check, Search } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";

interface FilterBarProps {
  setFilter: (filter: string) => void;
  activeFilter: string;
  className?: string;
  products?: Product[];
}

export function FilterBar({ setFilter, activeFilter, className = "", products = [] }: FilterBarProps) {
  const [priceRange, setPriceRange] = useState([60, 160]);

  // Derive unique colors from real product data
  const uniqueColors = [...new Set(
    products.map(p => p.color).filter((c): c is string => Boolean(c))
  )];

  return (
    <aside className={`w-full ${className}`}>
      
      {/* Mobile Scrollable Bar (Visible only on small screens) */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 mb-6">
         <FilterChip label="Todas" active={activeFilter === "all"} onClick={() => setFilter("all")} />
         <FilterChip label="Academia" active={activeFilter === "academia"} onClick={() => setFilter("academia")} />
         <FilterChip label="Personalizável" active={activeFilter === "custom"} onClick={() => setFilter("custom")} />
         {uniqueColors.map(color => (
           <button
             key={color}
             onClick={() => setFilter(color)}
             className={`w-8 h-8 rounded-full flex-shrink-0 transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ${
               activeFilter === color ? 'ring-gray-900 scale-110' : 'ring-transparent'
             }`}
             style={{ backgroundColor: color }}
             aria-label={`Filtrar por cor ${color}`}
           />
         ))}
      </div>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:block space-y-10 pr-6">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">Categorias</h3>
          <div className="space-y-3">
             <FilterCheckbox label="Todas" count={products.length} checked={activeFilter === "all"} onChange={() => setFilter("all")} />
             <FilterCheckbox label="Academia" count={products.filter(p => p.tags?.includes('academia')).length || undefined} checked={activeFilter === "academia"} onChange={() => setFilter("academia")} />
             <FilterCheckbox label="Personalizável" count={products.filter(p => p.customizable).length || undefined} checked={activeFilter === "custom"} onChange={() => setFilter("custom")} />
          </div>
        </div>

        {/* Price Slider */}
        <div>
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-base font-bold text-gray-900">Preço</h3>
             <span className="text-sm font-medium text-gray-500">
               R$ {priceRange[0]} - R$ {priceRange[1]}
             </span>
           </div>
           
           <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer group"
              value={priceRange}
              min={0}
              max={300}
              step={10}
              onValueChange={setPriceRange}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-gray-900 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-full hover:scale-110 focus:outline-none transition-transform"
                aria-label="Min price"
              />
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-full hover:scale-110 focus:outline-none transition-transform"
                aria-label="Max price"
              />
            </Slider.Root>
        </div>

        {/* Colors — Dynamic from products */}
        {uniqueColors.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Cor</h3>
            <div className="grid grid-cols-5 gap-3">
               {uniqueColors.map(color => (
                 <ColorSwatch
                   key={color}
                   color={color}
                   selected={activeFilter === color}
                   onClick={() => setFilter(activeFilter === color ? 'all' : color)}
                 />
               ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  )
}

interface FilterCheckboxProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: () => void;
}

function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center group cursor-pointer">
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${checked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300 group-hover:border-gray-500'}`}>
         {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange || (() => {})} />
      <span className={`ml-3 text-sm ${checked ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{label}</span>
      {count && <span className="ml-auto text-xs text-gray-400">({count})</span>}
    </label>
  )
}

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

function ColorSwatch({ color, selected, onClick }: ColorSwatchProps) {
  return (
    <button 
      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ${selected ? 'ring-gray-900 scale-110' : 'ring-transparent'}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`Filtrar por cor ${color}`}
    />
  )
}

interface FilterChipProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}

function FilterChip({ label, onClick, active = false }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap cursor-pointer border ${
        active 
          ? "bg-gray-900 text-white border-gray-900" 
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  )
}
