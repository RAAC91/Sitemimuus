"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Using a specific type for props instead of inferring from NextThemesProvider to be safer
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function AppThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
