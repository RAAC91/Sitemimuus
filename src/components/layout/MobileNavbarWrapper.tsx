"use client";

import dynamic from "next/dynamic";

export const MobileNavbar = dynamic(
  () => import("./MobileNavbar").then((mod) => mod.MobileNavbar),
  { ssr: false }
);
