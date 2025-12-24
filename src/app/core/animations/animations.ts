import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes,
  animateChild,
  AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Animation System - Reusable animations for Angular
 * Equivalent to Framer Motion in React/Next.js stack
 * 
 * Provides smooth, performant animations for common UI patterns
 */

// Timing constants
const DURATION_FAST = 150;
const DURATION_NORMAL = 200;
const DURATION_SLOW = 300;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1 })),
  ]),
]);

export const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 0 })),
  ]),
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 0 })),
  ]),
]);

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInDown = trigger('slideInDown', [
  transition(':enter', [
    style({ transform: 'translateY(-10px)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

export const slideInUp = trigger('slideInUp', [
  transition(':enter', [
    style({ transform: 'translateY(10px)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-10px)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
]);

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(10px)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
]);

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'scale(1)', opacity: 1 })),
  ]),
]);

export const scaleOut = trigger('scaleOut', [
  transition(':leave', [
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'scale(0.95)', opacity: 0 })),
  ]),
]);

export const scaleInOut = trigger('scaleInOut', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'scale(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ transform: 'scale(0.95)', opacity: 0 })),
  ]),
]);

// ============================================
// MODAL/DIALOG ANIMATIONS
// ============================================

export const modalEnter = trigger('modalEnter', [
  transition(':enter', [
    style({ transform: 'scale(0.9) translateY(-10px)', opacity: 0 }),
    animate(`${DURATION_SLOW}ms ${EASING}`, style({ transform: 'scale(1) translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`${DURATION_FAST}ms ${EASING}`, style({ transform: 'scale(0.95)', opacity: 0 })),
  ]),
]);

export const backdropFade = trigger('backdropFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`${DURATION_FAST}ms ${EASING}`, style({ opacity: 0 })),
  ]),
]);

// ============================================
// LIST ANIMATIONS (Stagger)
// ============================================

export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger(50, [
        animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
]);

export const listFadeIn = trigger('listFadeIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0 }),
      stagger(30, [
        animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1 })),
      ]),
    ], { optional: true }),
  ]),
]);

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardEnter = trigger('cardEnter', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate(`${DURATION_SLOW}ms ${EASING}`, style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

export const cardHover = trigger('cardHover', [
  transition(':enter', []),
  transition('* => *', [
    animate(`${DURATION_FAST}ms ${EASING}`),
  ]),
]);

// ============================================
// ROUTE TRANSITIONS
// ============================================

export const routeFade = trigger('routeFade', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
      }),
    ], { optional: true }),
    query(':enter', [
      animate(`${DURATION_NORMAL}ms ${EASING}`, style({ opacity: 1 })),
    ], { optional: true }),
  ]),
]);

export const routeSlide = trigger('routeSlide', [
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)' }),
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    query(':leave', [
      animate(`${DURATION_SLOW}ms ${EASING}`, style({ transform: 'translateX(-100%)' })),
    ], { optional: true }),
    query(':enter', [
      animate(`${DURATION_SLOW}ms ${EASING}`, style({ transform: 'translateX(0%)' })),
    ], { optional: true }),
  ]),
]);

// Note: animateChild is imported from @angular/animations

// ============================================
// SPRING ANIMATIONS (Framer Motion style)
// ============================================

export const springIn = trigger('springIn', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate(
      `${DURATION_SLOW}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
      style({ transform: 'scale(1)', opacity: 1 })
    ),
  ]),
]);

export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate(
      `${DURATION_SLOW}ms`,
      keyframes([
        style({ transform: 'scale(0.3)', opacity: 0, offset: 0 }),
        style({ transform: 'scale(1.1)', offset: 0.5 }),
        style({ transform: 'scale(1)', opacity: 1, offset: 1 }),
      ])
    ),
  ]),
]);

// ============================================
// EXPORT ALL ANIMATIONS
// ============================================

export const animations = [
  fadeIn,
  fadeOut,
  fadeInOut,
  slideInDown,
  slideInUp,
  slideInLeft,
  slideInRight,
  scaleIn,
  scaleOut,
  scaleInOut,
  modalEnter,
  backdropFade,
  listStagger,
  listFadeIn,
  cardEnter,
  cardHover,
  routeFade,
  springIn,
  bounceIn,
];

