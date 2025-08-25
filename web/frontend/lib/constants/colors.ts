/**
 * SYSTÈME DE COULEURS PREMIUM
 * 
 * Palette de couleurs cohérente pour dark/light mode avec
 * variations sémantiques et accessibilité garantie.
 */

// ============================================================================
// COULEURS DE BASE
// ============================================================================

export const baseColors = {
  // Primaires (Bleu Shopify-inspired)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Couleur principale
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Secondaires (Violet moderne)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Neutres (Gris adaptatifs)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // États sémantiques
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
} as const;

// ============================================================================
// THÈME LIGHT MODE
// ============================================================================

export const lightTheme = {
  // Couleurs de surface
  background: {
    primary: baseColors.neutral[50], // #fafafa
    secondary: '#ffffff',
    tertiary: baseColors.neutral[100], // #f5f5f5
    elevated: '#ffffff',
  },
  
  // Couleurs de texte
  text: {
    primary: baseColors.neutral[900], // #171717
    secondary: baseColors.neutral[600], // #525252
    tertiary: baseColors.neutral[400], // #a3a3a3
    inverse: '#ffffff',
    disabled: baseColors.neutral[300], // #d4d4d4
  },
  
  // Couleurs d'interaction
  primary: {
    default: baseColors.primary[500], // #3b82f6
    hover: baseColors.primary[600], // #2563eb
    active: baseColors.primary[700], // #1d4ed8
    disabled: baseColors.primary[300], // #93c5fd
    subtle: baseColors.primary[50], // #eff6ff
  },
  
  secondary: {
    default: baseColors.secondary[500], // #a855f7
    hover: baseColors.secondary[600], // #9333ea
    active: baseColors.secondary[700], // #7c3aed
    disabled: baseColors.secondary[300], // #d8b4fe
    subtle: baseColors.secondary[50], // #faf5ff
  },
  
  // Bordures et séparateurs
  border: {
    default: baseColors.neutral[200], // #e5e5e5
    hover: baseColors.neutral[300], // #d4d4d4
    focus: baseColors.primary[500], // #3b82f6
    error: baseColors.error[500], // #ef4444
  },
  
  // États sémantiques
  success: {
    background: baseColors.success[50],
    border: baseColors.success[200],
    text: baseColors.success[700],
    icon: baseColors.success[500],
  },
  
  warning: {
    background: baseColors.warning[50],
    border: baseColors.warning[200],
    text: baseColors.warning[700],
    icon: baseColors.warning[500],
  },
  
  error: {
    background: baseColors.error[50],
    border: baseColors.error[200],
    text: baseColors.error[700],
    icon: baseColors.error[500],
  },
  
  info: {
    background: baseColors.info[50],
    border: baseColors.info[200],
    text: baseColors.info[700],
    icon: baseColors.info[500],
  },
  
  // Ombres et élévations
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// ============================================================================
// THÈME DARK MODE
// ============================================================================

export const darkTheme = {
  // Couleurs de surface
  background: {
    primary: baseColors.neutral[950], // #0a0a0a
    secondary: baseColors.neutral[900], // #171717
    tertiary: baseColors.neutral[800], // #262626
    elevated: baseColors.neutral[900], // #171717
  },
  
  // Couleurs de texte
  text: {
    primary: baseColors.neutral[50], // #fafafa
    secondary: baseColors.neutral[300], // #d4d4d4
    tertiary: baseColors.neutral[500], // #737373
    inverse: baseColors.neutral[900], // #171717
    disabled: baseColors.neutral[600], // #525252
  },
  
  // Couleurs d'interaction
  primary: {
    default: baseColors.primary[400], // #60a5fa
    hover: baseColors.primary[300], // #93c5fd
    active: baseColors.primary[500], // #3b82f6
    disabled: baseColors.primary[700], // #1d4ed8
    subtle: baseColors.primary[950], // #172554
  },
  
  secondary: {
    default: baseColors.secondary[400], // #c084fc
    hover: baseColors.secondary[300], // #d8b4fe
    active: baseColors.secondary[500], // #a855f7
    disabled: baseColors.secondary[700], // #7c3aed
    subtle: baseColors.secondary[950], // #3b0764
  },
  
  // Bordures et séparateurs
  border: {
    default: baseColors.neutral[700], // #404040
    hover: baseColors.neutral[600], // #525252
    focus: baseColors.primary[400], // #60a5fa
    error: baseColors.error[500], // #ef4444
  },
  
  // États sémantiques (adaptés pour le dark)
  success: {
    background: baseColors.success[950],
    border: baseColors.success[800],
    text: baseColors.success[300],
    icon: baseColors.success[400],
  },
  
  warning: {
    background: baseColors.warning[950],
    border: baseColors.warning[800],
    text: baseColors.warning[300],
    icon: baseColors.warning[400],
  },
  
  error: {
    background: baseColors.error[950],
    border: baseColors.error[800],
    text: baseColors.error[300],
    icon: baseColors.error[400],
  },
  
  info: {
    background: baseColors.info[950],
    border: baseColors.info[800],
    text: baseColors.info[300],
    icon: baseColors.info[400],
  },
  
  // Ombres et élévations (adaptées pour le dark)
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  },
} as const;

// ============================================================================
// UTILITAIRES ET HELPERS
// ============================================================================

/**
 * Type pour les thèmes disponibles
 */
export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

/**
 * Obtient les couleurs selon le thème actuel
 */
export const getThemeColors = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Variables CSS pour l'intégration avec Tailwind
 */
export const cssVariables = {
  light: {
    '--color-bg-primary': lightTheme.background.primary,
    '--color-bg-secondary': lightTheme.background.secondary,
    '--color-bg-tertiary': lightTheme.background.tertiary,
    '--color-text-primary': lightTheme.text.primary,
    '--color-text-secondary': lightTheme.text.secondary,
    '--color-text-tertiary': lightTheme.text.tertiary,
    '--color-primary': lightTheme.primary.default,
    '--color-primary-hover': lightTheme.primary.hover,
    '--color-border': lightTheme.border.default,
    '--color-border-hover': lightTheme.border.hover,
    '--shadow-default': lightTheme.shadow.default,
    '--shadow-lg': lightTheme.shadow.lg,
  },
  
  dark: {
    '--color-bg-primary': darkTheme.background.primary,
    '--color-bg-secondary': darkTheme.background.secondary,
    '--color-bg-tertiary': darkTheme.background.tertiary,
    '--color-text-primary': darkTheme.text.primary,
    '--color-text-secondary': darkTheme.text.secondary,
    '--color-text-tertiary': darkTheme.text.tertiary,
    '--color-primary': darkTheme.primary.default,
    '--color-primary-hover': darkTheme.primary.hover,
    '--color-border': darkTheme.border.default,
    '--color-border-hover': darkTheme.border.hover,
    '--shadow-default': darkTheme.shadow.default,
    '--shadow-lg': darkTheme.shadow.lg,
  },
} as const;

/**
 * Classes Tailwind personnalisées basées sur les variables CSS
 */
export const customClasses = {
  // Backgrounds
  'bg-primary': 'bg-[var(--color-bg-primary)]',
  'bg-secondary': 'bg-[var(--color-bg-secondary)]',
  'bg-tertiary': 'bg-[var(--color-bg-tertiary)]',
  
  // Text
  'text-primary': 'text-[var(--color-text-primary)]',
  'text-secondary': 'text-[var(--color-text-secondary)]',
  'text-tertiary': 'text-[var(--color-text-tertiary)]',
  
  // Borders
  'border-default': 'border-[var(--color-border)]',
  'border-hover': 'hover:border-[var(--color-border-hover)]',
  
  // Shadows
  'shadow-default': 'shadow-[var(--shadow-default)]',
  'shadow-large': 'shadow-[var(--shadow-lg)]',
  
  // Interactive
  'btn-primary': 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
} as const;

// ============================================================================
// COULEURS SPÉCIFIQUES AUX COMPOSANTS
// ============================================================================

export const componentColors = {
  // Post cards
  postCard: {
    light: {
      background: '#ffffff',
      border: baseColors.neutral[200],
      hover: baseColors.neutral[50],
    },
    dark: {
      background: baseColors.neutral[900],
      border: baseColors.neutral[700],
      hover: baseColors.neutral[800],
    },
  },
  
  // Navigation
  nav: {
    light: {
      background: '#ffffff',
      border: baseColors.neutral[200],
      active: baseColors.primary[50],
      hover: baseColors.neutral[50],
    },
    dark: {
      background: baseColors.neutral[900],
      border: baseColors.neutral[700],
      active: baseColors.primary[950],
      hover: baseColors.neutral[800],
    },
  },
  
  // Dashboard
  dashboard: {
    light: {
      sidebar: '#ffffff',
      content: baseColors.neutral[50],
      card: '#ffffff',
    },
    dark: {
      sidebar: baseColors.neutral[900],
      content: baseColors.neutral[950],
      card: baseColors.neutral[900],
    },
  },
  
  // Forms
  form: {
    light: {
      input: '#ffffff',
      inputBorder: baseColors.neutral[300],
      inputFocus: baseColors.primary[500],
      label: baseColors.neutral[700],
    },
    dark: {
      input: baseColors.neutral[800],
      inputBorder: baseColors.neutral[600],
      inputFocus: baseColors.primary[400],
      label: baseColors.neutral[300],
    },
  },
} as const;

const colorsExport = {
  baseColors,
  lightTheme,
  darkTheme,
  getThemeColors,
  cssVariables,
  customClasses,
  componentColors,
};

export default colorsExport;