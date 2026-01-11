/**
 * Mind Gym Design System
 * 
 * Design Philosophy:
 * - White = space to think
 * - Blue = clarity & direction
 * - Minimal accents = discipline
 * 
 * This is intellectual, sky-inspired, ink-on-paper blue.
 * Not medical blue. No gradients, no neon.
 */

import { Platform } from 'react-native';

export const Colors = {
  // Primary Colors
  primary: '#1E3A8A', // deep thinking blue
  background: '#FAFBFC', // soft white, not pure
  
  // Text Colors
  textPrimary: '#0F172A', // ink black
  textSecondary: '#475569', // calm gray
  
  // UI Colors
  border: '#E2E8F0', // subtle line
  divider: '#E2E8F0', // subtle line
  
  // Accent (Use Sparingly)
  accent: '#3B82F6', // only for active states
  success: '#4ADE80', // rare, streaks only
  
  // Navigation (for tab bars)
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#1E3A8A',
  
  // Legacy compatibility (will be phased out)
  tint: '#1E3A8A',
  icon: '#94A3B8',
};

// Typography
// System font only - no decorative fonts
// Headings: Medium weight
// Body: Regular weight
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Shape Language
// Radius: 6-8 only
// No shadows (or 1% shadow max)
// More padding > more colors
export const radius = {
  sm: 6,
  md: 8,
};
