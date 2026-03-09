"use client"

import { useState } from "react"
import { CategoryHero } from "@/components/category/CategoryHero"
import { FilterBar } from "@/components/category/FilterBar"
import { ProductsGrid } from "@/components/category/ProductsGrid"
import { CollectionsRail } from "@/components/category/CollectionsRail"
import { ProductDisplayProvider } from "@/contexts/ProductDisplayContext"
import { ProductDisplayControls } from "@/components/category/ProductDisplayControls"

import { TrustBar } from "@/components/TrustBar"
import { SortBar } from "@/components/category/SortBar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Product } from "@/types"

interface ProductsClientPageProps {
  initialProducts: Product[]
}

export default function ProductsClientPage({ initialProducts }: ProductsClientPageProps) {
  const [filter, setFilter] = useState("all")
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2)
  
  const filteredProducts = initialProducts.filter(p => {
    if (filter === "all") return true
    return p.tags?.includes(filter) || p.category === filter || p.color === filter
  })

  return (
    <ProductDisplayProvider>
      <div className="min-h-screen bg-color-surface">
        <CategoryHero />
        <main className="max-w-[1600px] mx-auto px-4 md:px-12 py-12">
          <Breadcrumb 
            items={[{ label: "PRODUTOS" }]} 
            className="mb-8"
          />
          
          <CollectionsRail />

          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 items-start pt-16 border-t border-gray-100">
            
            <FilterBar 
              setFilter={setFilter} 
              activeFilter={filter} 
              products={initialProducts}
              className="sticky top-32 z-10" 
            />

            <div className="w-full space-y-10">
              <SortBar 
                resultCount={filteredProducts.length}
                mobileColumns={mobileColumns}
                onMobileColumnsChange={setMobileColumns}
              />
              <ProductsGrid products={filteredProducts} mobileColumns={mobileColumns} />
            </div>

          </div>
        </main>

        <section className="border-t border-gray-100">
          <TrustBar />
        </section>
        
        {/* Floating Calibration Controls */}
        <ProductDisplayControls />
      </div>
    </ProductDisplayProvider>
  )
}
