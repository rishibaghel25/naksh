import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { Colors, CommonStyles } from '../../constants/theme';

interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: string;
  fullWidth?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled,
  style,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = { ...CommonStyles.button };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled || loading ? Colors.textTertiary : Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled || loading ? Colors.textTertiary : Colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: disabled ? Colors.border : Colors.primary,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled || loading ? Colors.textTertiary : Colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    if (variant === 'outline') {
      return disabled ? Colors.textTertiary : Colors.primary;
    }
    return Colors.textInverse;
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[CommonStyles.buttonText, { color: getTextColor() }]}>
          {icon && `${icon} `}{title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});

export default AnimatedButton;
