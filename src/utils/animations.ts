import { Variants, Transition } from "framer-motion";

// Configurations "spring" récurrentes
export const defaultSpring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 26,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

export const slowSpring: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 15,
};

export const bouncySpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const layoutSpring: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
};

// Variantes conteneurs avec "stagger"
export const getStaggerContainer = (staggerDelay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

// Variantes d'apparition (Fade & Slide)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: gentleSpring },
};

export const fadeOutDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: gentleSpring },
};

export const slowFadeInUp: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const getScaleFadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: defaultSpring },
  exit: { opacity: 0, x: -40, transition: defaultSpring },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Variantes pour les transitions de page (React Router)
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } },
};
