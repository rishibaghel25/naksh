import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  variant?: 'warning' | 'info' | 'error';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '✨',
  title,
  message,
  buttonText,
  onButtonPress,
  variant = 'warning',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          card: styles.warningCard,
          title: styles.warningTitle,
          text: styles.warningText,
          button: styles.warningButton,
        };
      case 'info':
        return {
          card: styles.infoCard,
          title: styles.infoTitle,
          text: styles.infoText,
          button: styles.infoButton,
        };
      case 'error':
        return {
          card: styles.errorCard,
          title: styles.errorTitle,
          text: styles.errorText,
          button: styles.errorButton,
        };
      default:
        return {
          card: styles.warningCard,
          title: styles.warningTitle,
          text: styles.warningText,
          button: styles.warningButton,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.card, variantStyles.card]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, variantStyles.title]}>{title}</Text>
      <Text style={[styles.text, variantStyles.text]}>{message}</Text>
      {buttonText && onButtonPress && (
        <TouchableOpacity style={[styles.button, variantStyles.button]} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.base,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: Typography.fontSize.massive,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.base,
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Warning variant
  warningCard: {
    backgroundColor: Colors.warningBg,
    borderColor: '#FCD34D',
  },
  warningTitle: {
    color: '#92400E',
  },
  warningText: {
    color: '#78350F',
  },
  warningButton: {
    backgroundColor: Colors.warning,
  },
  // Info variant
  infoCard: {
    backgroundColor: Colors.infoBg,
    borderColor: '#93C5FD',
  },
  infoTitle: {
    color: '#1E3A8A',
  },
  infoText: {
    color: '#1E40AF',
  },
  infoButton: {
    backgroundColor: Colors.info,
  },
  // Error variant
  errorCard: {
    backgroundColor: Colors.errorBg,
    borderColor: '#FCA5A5',
  },
  errorTitle: {
    color: '#991B1B',
  },
  errorText: {
    color: '#B91C1C',
  },
  errorButton: {
    backgroundColor: Colors.error,
  },
});

export default EmptyState;
