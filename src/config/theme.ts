export const siteTheme = {
  colors: {
    // Brand Identity (Configurable via CMS)
    primary: '#ff4586', // Mimuus Pink
    secondary: '#00e5cc', // Mimuus Cyan
    accent: '#2d3142', // Dark/Black brand color
    
    // Backgrounds
    background: '#FDFBF7', // "Mimoso" Cream
    surface: '#ffffff',
    surfaceHighlight: '#f8fafc',

    // Text
    textPrimary: '#2d3142',
    textSecondary: '#64748b',
    textInverse: '#ffffff',

    // Functional
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',

    // Specific UI Elements (Shopify-style granular control)
    buttonPrimaryBg: '#2d3142',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: '#ffffff',
    buttonSecondaryText: '#2d3142',
    
    badgeNewBg: '#00e5cc',
    badgeNewText: '#ffffff',
    badgeSaleBg: '#ff4586',
    badgeSaleText: '#ffffff',
    
    reviewStar: '#00e5cc',
  },
  typography: {
    fontHeading: 'var(--font-geologica)',
    fontBody: 'var(--font-sans)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  spacing: {
    sectionPadding: '5rem',
    containerMax: '1280px',
  }
}

export type SiteTheme = typeof siteTheme;
