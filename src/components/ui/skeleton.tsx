"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-100/50 backdrop-blur-sm rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "50%" }}
      />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="p-6 rounded-[2rem] border border-gray-50 space-y-6">
      <Skeleton className="aspect-4/5 rounded-[2.5rem]" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
