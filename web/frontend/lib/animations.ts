/**
 * SYSTÈME D'ANIMATIONS PREMIUM
 * 
 * Classes d'animation réutilisables et utilitaires pour créer
 * une expérience utilisateur fluide et premium.
 */

// ============================================================================
// TIMING FUNCTIONS & DURÉES
// ============================================================================

export const timing = {
  // Durées standardisées
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
  
  // Easing functions personnalisées
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// ============================================================================
// CLASSES CSS POUR ANIMATIONS
// ============================================================================

export const animations = {
  // Fade animations
  fadeIn: `
    opacity: 0;
    animation: fadeIn ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
  `,
  
  fadeOut: `
    opacity: 1;
    animation: fadeOut ${timing.fast} ${timing.easeIn} forwards;
    
    @keyframes fadeOut {
      to { opacity: 0; }
    }
  `,
  
  // Slide animations
  slideInUp: `
    opacity: 0;
    transform: translateY(20px);
    animation: slideInUp ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  slideInDown: `
    opacity: 0;
    transform: translateY(-20px);
    animation: slideInDown ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes slideInDown {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  slideInLeft: `
    opacity: 0;
    transform: translateX(-20px);
    animation: slideInLeft ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes slideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  slideInRight: `
    opacity: 0;
    transform: translateX(20px);
    animation: slideInRight ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes slideInRight {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  // Scale animations
  scaleIn: `
    opacity: 0;
    transform: scale(0.9);
    animation: scaleIn ${timing.normal} ${timing.spring} forwards;
    
    @keyframes scaleIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  
  scaleOut: `
    opacity: 1;
    transform: scale(1);
    animation: scaleOut ${timing.fast} ${timing.easeIn} forwards;
    
    @keyframes scaleOut {
      to {
        opacity: 0;
        transform: scale(0.9);
      }
    }
  `,
  
  // Micro-interactions
  heartPop: `
    animation: heartPop ${timing.fast} ${timing.bounce};
    
    @keyframes heartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `,
  
  bounce: `
    animation: bounce ${timing.slow} ${timing.bounce};
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `,
  
  shake: `
    animation: shake ${timing.normal} ease-in-out;
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
  
  pulse: `
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  
  // Loading animations
  spin: `
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  
  shimmer: `
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.4) 50%, 
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  
  // Hover effects
  hoverLift: `
    transition: transform ${timing.fast} ${timing.easeOut}, 
                box-shadow ${timing.fast} ${timing.easeOut};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  `,
  
  hoverScale: `
    transition: transform ${timing.fast} ${timing.easeOut};
    
    &:hover {
      transform: scale(1.02);
    }
  `,
  
  hoverGlow: `
    transition: box-shadow ${timing.fast} ${timing.easeOut};
    
    &:hover {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
  `,
} as const;

// ============================================================================
// UTILITAIRES D'ANIMATION
// ============================================================================

/**
 * Génère une animation de délai progressif pour les listes
 */
export const generateStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};

/**
 * Classes CSS pour animations staggerées
 */
export const staggeredAnimation = (maxItems: number = 10): string => {
  let css = '';
  
  for (let i = 0; i < maxItems; i++) {
    css += `
      &:nth-child(${i + 1}) {
        animation-delay: ${generateStaggerDelay(i)};
      }
    `;
  }
  
  return css;
};

/**
 * Animation d'apparition pour les éléments de liste
 */
export const listItemAnimation = `
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp ${timing.normal} ${timing.easeOut} forwards;
  
  ${staggeredAnimation(20)}
`;

// ============================================================================
// ANIMATIONS CONTEXTUELLES
// ============================================================================

export const contextualAnimations = {
  // Posts et contenu
  postCard: `
    ${animations.fadeIn}
    ${animations.hoverLift}
  `,
  
  postContent: `
    ${animations.slideInUp}
  `,
  
  // Modals et overlays
  modalBackdrop: `
    opacity: 0;
    backdrop-filter: blur(0px);
    animation: backdropFadeIn ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes backdropFadeIn {
      to {
        opacity: 1;
        backdrop-filter: blur(4px);
      }
    }
  `,
  
  modalContent: `
    opacity: 0;
    transform: scale(0.95) translateY(20px);
    animation: modalSlideIn ${timing.normal} ${timing.spring} forwards;
    
    @keyframes modalSlideIn {
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `,
  
  // Notifications et toasts
  toast: `
    opacity: 0;
    transform: translateX(100%);
    animation: toastSlideIn ${timing.normal} ${timing.easeOut} forwards;
    
    @keyframes toastSlideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  // Boutons et interactions
  buttonPress: `
    transition: transform ${timing.instant} ${timing.easeOut};
    
    &:active {
      transform: scale(0.98);
    }
  `,
  
  // Navigation et menu
  mobileDrawer: `
    transform: translateX(-100%);
    transition: transform ${timing.normal} ${timing.easeOut};
    
    &.open {
      transform: translateX(0);
    }
  `,
  
  // Loading et skeleton
  skeleton: `
    background: linear-gradient(90deg, 
      #f0f0f0 25%, 
      #e0e0e0 50%, 
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  `,
};

// ============================================================================
// HOOKS ET UTILITAIRES REACT
// ============================================================================

/**
 * Hook pour animations conditionnelles
 */
export const useConditionalAnimation = (
  condition: boolean, 
  enterAnimation: string, 
  exitAnimation: string
): string => {
  return condition ? enterAnimation : exitAnimation;
};

/**
 * Classes d'animation prêtes à l'emploi pour className
 */
export const animationClasses = {
  // Entrées
  'animate-fade-in': 'animate-[fadeIn_300ms_ease-out_forwards]',
  'animate-slide-up': 'animate-[slideInUp_300ms_ease-out_forwards]',
  'animate-slide-down': 'animate-[slideInDown_300ms_ease-out_forwards]',
  'animate-scale-in': 'animate-[scaleIn_300ms_cubic-bezier(0.34,1.56,0.64,1)_forwards]',
  
  // Interactions
  'hover-lift': 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
  'hover-scale': 'transition-transform duration-200 hover:scale-102',
  'hover-glow': 'transition-shadow duration-200 hover:shadow-blue-500/30',
  
  // Loading
  'animate-spin': 'animate-spin',
  'animate-pulse': 'animate-pulse',
  'animate-shimmer': 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
  
  // Micro-interactions
  'animate-heart-pop': 'animate-[heartPop_200ms_cubic-bezier(0.68,-0.55,0.265,1.55)]',
  'animate-bounce-once': 'animate-[bounce_500ms_cubic-bezier(0.68,-0.55,0.265,1.55)]',
} as const;

// ============================================================================
// ANIMATION VARIANTS POUR FRAMER MOTION (si utilisé)
// ============================================================================

export const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  },
  
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  
  modal: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: [0.7, 0, 0.84, 0],
      },
    },
  },
  
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
};

const animationsExport = {
  timing,
  animations,
  contextualAnimations,
  animationClasses,
  motionVariants,
  generateStaggerDelay,
  staggeredAnimation,
  listItemAnimation,
};

export default animationsExport;