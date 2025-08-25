/**
 * SYSTÈME D'ESPACEMENT PREMIUM
 * 
 * Scale d'espacement cohérente basée sur une progression
 * mathématique pour garantir un rythme visuel harmonieux.
 */

// ============================================================================
// ÉCHELLE D'ESPACEMENT DE BASE (basée sur 4px)
// ============================================================================

export const spacing = {
  // Micro espacements (0-8px)
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  
  // Petits espacements (12-24px)
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  
  // Moyens espacements (28-48px)
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  
  // Grands espacements (56-96px)
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  
  // Très grands espacements (128px+)
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// ============================================================================
// ESPACEMENTS SÉMANTIQUES
// ============================================================================

export const semanticSpacing = {
  // Espacements de contenu
  content: {
    // Espacement entre paragraphes
    paragraph: spacing[4], // 16px
    
    // Espacement entre sections
    section: spacing[8], // 32px
    
    // Espacement entre chapitres/blocs majeurs
    chapter: spacing[16], // 64px
    
    // Marges de contenu principal
    container: {
      mobile: spacing[4], // 16px
      tablet: spacing[6], // 24px
      desktop: spacing[8], // 32px
    },
  },
  
  // Espacements d'interface
  interface: {
    // Espacement entre éléments d'interface
    element: spacing[3], // 12px
    
    // Espacement entre groupes d'éléments
    group: spacing[6], // 24px
    
    // Espacement entre sections d'interface
    section: spacing[8], // 32px
    
    // Paddings standard
    padding: {
      tight: spacing[2], // 8px
      normal: spacing[4], // 16px
      loose: spacing[6], // 24px
      spacious: spacing[8], // 32px
    },
    
    // Marges standard
    margin: {
      tight: spacing[1], // 4px
      normal: spacing[3], // 12px
      loose: spacing[6], // 24px
      spacious: spacing[12], // 48px
    },
  },
  
  // Espacements de navigation
  navigation: {
    // Hauteur de la barre de navigation
    navHeight: spacing[16], // 64px
    
    // Espacement entre items de navigation
    itemSpacing: spacing[1], // 4px
    
    // Padding des items de navigation
    itemPadding: spacing[3], // 12px
    
    // Espacement du contenu sous la navigation
    contentOffset: spacing[20], // 80px
  },
  
  // Espacements de formulaire
  form: {
    // Espacement entre champs
    fieldSpacing: spacing[4], // 16px
    
    // Espacement entre groupes de champs
    groupSpacing: spacing[6], // 24px
    
    // Padding des inputs
    inputPadding: {
      vertical: spacing[2.5], // 10px
      horizontal: spacing[3], // 12px
    },
    
    // Espacement des labels
    labelSpacing: spacing[1.5], // 6px
    
    // Espacement des boutons
    buttonSpacing: spacing[3], // 12px
  },
  
  // Espacements de carte/card
  card: {
    // Padding interne de la carte
    padding: spacing[6], // 24px
    
    // Espacement entre cartes
    gap: spacing[4], // 16px
    
    // Espacement du contenu dans la carte
    contentSpacing: spacing[3], // 12px
    
    // Espacement des actions de carte
    actionSpacing: spacing[2], // 8px
  },
} as const;

// ============================================================================
// ESPACEMENTS PAR COMPOSANT
// ============================================================================

export const componentSpacing = {
  // Posts et contenu
  post: {
    // Espacement entre les posts
    gap: spacing[6], // 24px
    
    // Padding interne du post
    padding: spacing[6], // 24px
    
    // Espacement du contenu
    contentSpacing: spacing[4], // 16px
    
    // Espacement des métadonnées
    metaSpacing: spacing[2], // 8px
    
    // Espacement des actions (like, comment, etc.)
    actionSpacing: spacing[3], // 12px
  },
  
  // Commentaires
  comment: {
    // Espacement entre commentaires
    gap: spacing[4], // 16px
    
    // Indentation des réponses
    indent: spacing[6], // 24px
    
    // Padding interne
    padding: spacing[4], // 16px
    
    // Espacement du contenu
    contentSpacing: spacing[3], // 12px
  },
  
  // Dashboard
  dashboard: {
    // Espacement de la sidebar
    sidebarPadding: spacing[6], // 24px
    
    // Espacement du contenu principal
    contentPadding: spacing[8], // 32px
    
    // Espacement entre widgets
    widgetGap: spacing[6], // 24px
    
    // Espacement interne des widgets
    widgetPadding: spacing[6], // 24px
  },
  
  // Modals
  modal: {
    // Padding du contenu
    contentPadding: spacing[6], // 24px
    
    // Espacement du header
    headerPadding: spacing[6], // 24px
    
    // Espacement du footer
    footerPadding: spacing[4], // 16px
    
    // Espacement entre éléments
    elementSpacing: spacing[4], // 16px
  },
  
  // Boutons
  button: {
    // Padding des boutons
    padding: {
      small: {
        vertical: spacing[1.5], // 6px
        horizontal: spacing[3], // 12px
      },
      medium: {
        vertical: spacing[2.5], // 10px
        horizontal: spacing[4], // 16px
      },
      large: {
        vertical: spacing[3], // 12px
        horizontal: spacing[6], // 24px
      },
    },
    
    // Espacement entre boutons
    gap: spacing[3], // 12px
    
    // Espacement des icônes dans les boutons
    iconSpacing: spacing[2], // 8px
  },
  
  // Inputs et formulaires
  input: {
    // Padding des inputs
    padding: {
      vertical: spacing[2.5], // 10px
      horizontal: spacing[3], // 12px
    },
    
    // Espacement entre label et input
    labelSpacing: spacing[1.5], // 6px
    
    // Espacement de l'aide/erreur
    helpSpacing: spacing[1], // 4px
    
    // Espacement entre champs
    fieldSpacing: spacing[4], // 16px
  },
} as const;

// ============================================================================
// ESPACEMENTS RESPONSIVE
// ============================================================================

export const responsiveSpacing = {
  // Container margins par breakpoint
  container: {
    mobile: spacing[4], // 16px
    tablet: spacing[6], // 24px
    desktop: spacing[8], // 32px
    wide: spacing[12], // 48px
  },
  
  // Section spacing par breakpoint
  section: {
    mobile: spacing[8], // 32px
    tablet: spacing[12], // 48px
    desktop: spacing[16], // 64px
    wide: spacing[20], // 80px
  },
  
  // Navigation height par breakpoint
  navigation: {
    mobile: spacing[14], // 56px
    tablet: spacing[16], // 64px
    desktop: spacing[20], // 80px
  },
  
  // Grid gaps par breakpoint
  grid: {
    mobile: spacing[4], // 16px
    tablet: spacing[6], // 24px
    desktop: spacing[8], // 32px
  },
} as const;

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Convertit une valeur de spacing en rem
 */
export const toRem = (value: string): string => {
  const pixels = parseInt(value.replace('px', ''));
  return `${pixels / 16}rem`;
};

/**
 * Obtient un espacement responsive
 */
export const getResponsiveSpacing = (
  mobile: keyof typeof spacing,
  tablet?: keyof typeof spacing,
  desktop?: keyof typeof spacing
): Record<string, string> => {
  return {
    '--spacing-mobile': spacing[mobile],
    '--spacing-tablet': spacing[tablet || mobile],
    '--spacing-desktop': spacing[desktop || tablet || mobile],
  };
};

/**
 * Classes CSS pour espacements adaptatifs
 */
export const adaptiveSpacing = {
  // Padding responsive
  'p-responsive': 'p-4 md:p-6 lg:p-8',
  'px-responsive': 'px-4 md:px-6 lg:px-8',
  'py-responsive': 'py-4 md:py-6 lg:py-8',
  
  // Margin responsive
  'm-responsive': 'm-4 md:m-6 lg:m-8',
  'mx-responsive': 'mx-4 md:mx-6 lg:mx-8',
  'my-responsive': 'my-4 md:my-6 lg:my-8',
  
  // Gap responsive pour flexbox/grid
  'gap-responsive': 'gap-4 md:gap-6 lg:gap-8',
  
  // Spacing pour sections
  'section-spacing': 'py-8 md:py-12 lg:py-16',
  'container-spacing': 'px-4 md:px-6 lg:px-8',
} as const;

// ============================================================================
// VARIABLES CSS POUR INTÉGRATION
// ============================================================================

export const cssSpacingVariables = {
  // Variables de base
  '--spacing-xs': spacing[1], // 4px
  '--spacing-sm': spacing[2], // 8px
  '--spacing-md': spacing[4], // 16px
  '--spacing-lg': spacing[6], // 24px
  '--spacing-xl': spacing[8], // 32px
  '--spacing-2xl': spacing[12], // 48px
  '--spacing-3xl': spacing[16], // 64px
  
  // Variables sémantiques
  '--spacing-content': semanticSpacing.content.paragraph,
  '--spacing-section': semanticSpacing.content.section,
  '--spacing-element': semanticSpacing.interface.element,
  '--spacing-group': semanticSpacing.interface.group,
  
  // Variables de composants
  '--spacing-card-padding': componentSpacing.card.padding,
  '--spacing-card-gap': componentSpacing.card.gap,
  '--spacing-post-gap': componentSpacing.post.gap,
  '--spacing-modal-padding': componentSpacing.modal.contentPadding,
} as const;

/**
 * Classes Tailwind personnalisées basées sur le système d'espacement
 */
export const spacingClasses = {
  // Espacements standard
  'space-xs': 'space-y-1 space-x-1',
  'space-sm': 'space-y-2 space-x-2',
  'space-md': 'space-y-4 space-x-4',
  'space-lg': 'space-y-6 space-x-6',
  'space-xl': 'space-y-8 space-x-8',
  
  // Containers
  'container-tight': 'max-w-4xl mx-auto px-4 md:px-6',
  'container-normal': 'max-w-6xl mx-auto px-4 md:px-6 lg:px-8',
  'container-wide': 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
  'container-full': 'max-w-full mx-auto px-4 md:px-6 lg:px-8',
  
  // Sections
  'section-tight': 'py-8 md:py-12',
  'section-normal': 'py-12 md:py-16 lg:py-20',
  'section-spacious': 'py-16 md:py-20 lg:py-24',
  
  // Cards et panels
  'card-padding': 'p-6',
  'card-gap': 'space-y-4',
  'panel-padding': 'p-4 md:p-6',
  
  // Forms
  'form-spacing': 'space-y-4',
  'form-group-spacing': 'space-y-6',
  'input-padding': 'px-3 py-2.5',
  
  // Navigation
  'nav-padding': 'px-4 py-3',
  'nav-spacing': 'space-x-1',
} as const;

const spacingExport = {
  spacing,
  semanticSpacing,
  componentSpacing,
  responsiveSpacing,
  adaptiveSpacing,
  cssSpacingVariables,
  spacingClasses,
  toRem,
  getResponsiveSpacing,
};

export default spacingExport;