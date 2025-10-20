/**
 * NAKSH App Theme - Cosmic Design System
 * Consistent colors, spacing, typography, and styling for the entire app
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

// Cosmic Color Palette - Blues, Purples, Golds
export const Colors = {
  // Primary Colors
  primary: '#6366F1',        // Indigo - main brand color
  primaryDark: '#4F46E5',    // Darker indigo for hover/pressed states
  primaryLight: '#818CF8',   // Lighter indigo for accents
  
  // Secondary Colors (Purple/Cosmic)
  secondary: '#8B5CF6',      // Purple - cosmic accent
  secondaryDark: '#7C3AED',  // Darker purple
  secondaryLight: '#A78BFA', // Lighter purple
  
  // Accent Colors (Gold/Mystical)
  accent: '#D4AF37',         // Gold - mystical accent
  accentLight: '#F59E0B',    // Amber gold
  
  // Neutral Colors
  background: '#F9FAFB',     // Light gray background
  surface: '#FFFFFF',        // White surface/cards
  surfaceAlt: '#F3F4F6',     // Alternative surface
  
  // Text Colors
  textPrimary: '#1F2937',    // Dark gray - primary text
  textSecondary: '#6B7280',  // Medium gray - secondary text
  textTertiary: '#9CA3AF',   // Light gray - tertiary text
  textInverse: '#FFFFFF',    // White text on dark backgrounds
  
  // Border Colors
  border: '#E5E7EB',         // Light border
  borderDark: '#D1D5DB',     // Darker border
  
  // Status Colors
  success: '#10B981',        // Green
  warning: '#F59E0B',        // Amber
  error: '#EF4444',          // Red
  info: '#3B82F6',           // Blue
  
  // Status Backgrounds
  successBg: '#D1FAE5',
  warningBg: '#FEF3C7',
  errorBg: '#FEE2E2',
  infoBg: '#DBEAFE',
  
  // Placeholder
  placeholder: '#9CA3AF',
  
  // Shadow
  shadow: '#000000',
};

// Spacing System (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 10,
  base: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Typography
export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 32,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  
  // Line Heights
  lineHeight: {
    tight: 18,
    base: 20,
    relaxed: 22,
    loose: 24,
  },
};

// Shadow Styles
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  colored: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Common Component Styles
export const CommonStyles = {
  // Card Style
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.base,
    padding: Spacing.xl,
    ...Shadows.md,
  } as ViewStyle,
  
  // Input Style
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
  } as ViewStyle & TextStyle,
  
  // Button Style
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.base,
    alignItems: 'center' as ViewStyle['alignItems'],
    ...Shadows.colored,
  } as ViewStyle,
  
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  } as TextStyle,
  
  // Section Title
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  } as TextStyle,
  
  // Error Text
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
    marginLeft: 4,
  } as TextStyle,
};

// Animation Durations
export const Animation = {
  fast: 150,
  base: 200,
  slow: 300,
};

// Platform-specific Fonts
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
