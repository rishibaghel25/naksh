import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';

interface HoroscopeCardProps {
  horoscope: string;
  moonSign?: string;
  nakshatra?: string;
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({
  horoscope,
  moonSign,
  nakshatra,
}) => {
  return (
    <View style={styles.horoscopeCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Your Daily Guidance</Text>
        {moonSign && (
          <View style={styles.moonSignBadge}>
            <Text style={styles.moonSignText}>{moonSign} Moon</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={styles.horoscopeText}>{horoscope}</Text>

      {nakshatra && (
        <View style={styles.nakshatraContainer}>
          <Text style={styles.nakshatraLabel}>Your Nakshatra:</Text>
          <Text style={styles.nakshatraValue}>{nakshatra}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  horoscopeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  moonSignBadge: {
    backgroundColor: Colors.infoBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.base,
  },
  moonSignText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.base,
  },
  horoscopeText: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.loose,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  nakshatraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nakshatraLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  nakshatraValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
});

export default HoroscopeCard;
