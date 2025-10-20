# NAKSH Theme Usage Guide

Quick reference for using the centralized theme system in the NAKSH Astrology App.

## Importing the Theme

```typescript
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  Typography, 
  Shadows, 
  CommonStyles 
} from '../constants/theme';
```

## Colors

### Primary Colors (Indigo)
```typescript
Colors.primary        // #6366F1 - Main brand color
Colors.primaryDark    // #4F46E5 - Hover/pressed states
Colors.primaryLight   // #818CF8 - Light accents
```

### Secondary Colors (Purple/Cosmic)
```typescript
Colors.secondary      // #8B5CF6 - Cosmic accent
Colors.secondaryDark  // #7C3AED - Darker purple
Colors.secondaryLight // #A78BFA - Lighter purple
```

### Accent Colors (Gold/Mystical)
```typescript
Colors.accent         // #D4AF37 - Gold accent
Colors.accentLight    // #F59E0B - Amber gold
```

### Backgrounds
```typescript
Colors.background     // #F9FAFB - Screen background
Colors.surface        // #FFFFFF - Card/surface
Colors.surfaceAlt     // #F3F4F6 - Alternative surface
```

### Text Colors
```typescript
Colors.textPrimary    // #1F2937 - Primary text
Colors.textSecondary  // #6B7280 - Secondary text
Colors.textTertiary   // #9CA3AF - Tertiary text
Colors.textInverse    // #FFFFFF - White text
```

### Borders
```typescript
Colors.border         // #E5E7EB - Light border
Colors.borderDark     // #D1D5DB - Darker border
```

### Status Colors
```typescript
Colors.success        // #10B981 - Green
Colors.warning        // #F59E0B - Amber
Colors.error          // #EF4444 - Red
Colors.info           // #3B82F6 - Blue

// Status backgrounds
Colors.successBg      // #D1FAE5
Colors.warningBg      // #FEF3C7
Colors.errorBg        // #FEE2E2
Colors.infoBg         // #DBEAFE
```

## Spacing (8px base grid)

```typescript
Spacing.xs            // 4px
Spacing.sm            // 8px
Spacing.md            // 12px
Spacing.base          // 16px
Spacing.lg            // 20px
Spacing.xl            // 24px
Spacing.xxl           // 32px
Spacing.xxxl          // 40px
```

### Usage Examples
```typescript
// Screen padding
padding: Spacing.lg,              // 20px

// Card padding
padding: Spacing.xl,              // 24px

// Margin between elements
marginBottom: Spacing.base,       // 16px

// Small gaps
gap: Spacing.sm,                  // 8px
```

## Border Radius

```typescript
BorderRadius.sm       // 8px
BorderRadius.md       // 10px
BorderRadius.base     // 12px
BorderRadius.lg       // 16px
BorderRadius.xl       // 20px
BorderRadius.full     // 9999px (circular)
```

### Usage Examples
```typescript
// Cards
borderRadius: BorderRadius.base,  // 12px

// Buttons
borderRadius: BorderRadius.base,  // 12px

// Inputs
borderRadius: BorderRadius.md,    // 10px

// Badges
borderRadius: BorderRadius.sm,    // 8px
```

## Typography

### Font Sizes
```typescript
Typography.fontSize.xs            // 12px
Typography.fontSize.sm            // 13px
Typography.fontSize.base          // 14px
Typography.fontSize.md            // 15px
Typography.fontSize.lg            // 16px
Typography.fontSize.xl            // 18px
Typography.fontSize.xxl           // 20px
Typography.fontSize.xxxl          // 24px
Typography.fontSize.huge          // 28px
Typography.fontSize.massive       // 32px
```

### Font Weights
```typescript
Typography.fontWeight.normal      // '400'
Typography.fontWeight.medium      // '500'
Typography.fontWeight.semibold    // '600'
Typography.fontWeight.bold        // '700'
```

### Line Heights
```typescript
Typography.lineHeight.tight       // 18px
Typography.lineHeight.base        // 20px
Typography.lineHeight.relaxed     // 22px
Typography.lineHeight.loose       // 24px
```

### Usage Examples
```typescript
// Screen title
fontSize: Typography.fontSize.huge,           // 28px
fontWeight: Typography.fontWeight.bold,       // '700'

// Section title
fontSize: Typography.fontSize.xl,             // 18px
fontWeight: Typography.fontWeight.bold,       // '700'

// Body text
fontSize: Typography.fontSize.md,             // 15px
lineHeight: Typography.lineHeight.loose,      // 24px

// Label
fontSize: Typography.fontSize.base,           // 14px
fontWeight: Typography.fontWeight.semibold,   // '600'
```

## Shadows

```typescript
Shadows.sm            // Subtle shadow
Shadows.base          // Standard shadow
Shadows.md            // Medium shadow
Shadows.lg            // Large shadow
Shadows.colored       // Colored shadow (for primary buttons)
```

### Usage Examples
```typescript
// Card
...Shadows.md,

// Button
...Shadows.colored,

// Small element
...Shadows.sm,
```

## Common Styles

Pre-built component styles for consistency:

### Card
```typescript
style={CommonStyles.card}
// Includes: white background, border radius, padding, shadow
```

### Input
```typescript
style={CommonStyles.input}
// Includes: white background, border, border radius, padding, font size
```

### Button
```typescript
style={CommonStyles.button}
// Includes: primary color, border radius, padding, shadow
```

### Button Text
```typescript
style={CommonStyles.buttonText}
// Includes: white color, font size, font weight
```

### Section Title
```typescript
style={CommonStyles.sectionTitle}
// Includes: font size, font weight, color, margin
```

### Error Text
```typescript
style={CommonStyles.errorText}
// Includes: error color, font size, margin
```

## Complete Component Example

```typescript
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  Typography, 
  Shadows,
  CommonStyles 
} from '../constants/theme';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      {/* Card using CommonStyles */}
      <View style={CommonStyles.card}>
        <Text style={CommonStyles.sectionTitle}>Section Title</Text>
        
        {/* Input using CommonStyles */}
        <TextInput 
          style={CommonStyles.input}
          placeholder="Enter text"
          placeholderTextColor={Colors.placeholder}
        />
        
        {/* Button using CommonStyles */}
        <TouchableOpacity style={CommonStyles.button}>
          <Text style={CommonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
});

export default MyComponent;
```

## Custom Styling with Theme

```typescript
const styles = StyleSheet.create({
  customCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  
  customText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.relaxed,
  },
  
  customButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    ...Shadows.colored,
  },
});
```

## Best Practices

### ✅ DO
- Use theme constants for all colors, spacing, and typography
- Use CommonStyles for standard components
- Spread shadow objects with `...Shadows.md`
- Use semantic color names (textPrimary, not #1F2937)
- Use spacing constants (Spacing.lg, not 20)

### ❌ DON'T
- Hard-code colors (#6366F1)
- Hard-code spacing values (20, 24)
- Hard-code font sizes (16, 18)
- Use magic numbers
- Duplicate styles across components

## Animation Durations

```typescript
import { Animation } from '../constants/theme';

// Usage in animations
duration: Animation.fast,    // 150ms
duration: Animation.base,    // 200ms
duration: Animation.slow,    // 300ms
```

## Cosmic Theme Guidelines

### When to use each color:

**Primary (Indigo)**: 
- Main actions (buttons, links)
- Active states
- Primary accents

**Secondary (Purple)**:
- Cosmic/mystical elements
- Birth chart sections
- Special highlights

**Accent (Gold)**:
- Important highlights
- Chart elements
- Premium features

**Neutral (Grays)**:
- Backgrounds
- Text
- Borders
- Disabled states

## Quick Reference Card

```
COLORS:
Primary: #6366F1 (Indigo)
Secondary: #8B5CF6 (Purple)
Accent: #D4AF37 (Gold)
Background: #F9FAFB
Surface: #FFFFFF

SPACING:
xs: 4, sm: 8, md: 12, base: 16
lg: 20, xl: 24, xxl: 32, xxxl: 40

BORDER RADIUS:
sm: 8, md: 10, base: 12, lg: 16, xl: 20

FONT SIZES:
xs: 12, sm: 13, base: 14, md: 15, lg: 16
xl: 18, xxl: 20, xxxl: 24, huge: 28, massive: 32

FONT WEIGHTS:
normal: 400, medium: 500, semibold: 600, bold: 700
```

## Support

For questions or issues with the theme system, refer to:
- `constants/theme.ts` - Full theme definition
- `UI_POLISH_SUMMARY.md` - Implementation details
- `UI_TESTING_CHECKLIST.md` - Testing guidelines
