import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface LagnaChartProps {
  ascendant: string;
  moonSign: string;
  sunSign: string;
}

const SIGN_NUMBERS: { [key: string]: number } = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

const SIGN_ABBREVIATIONS: { [key: string]: string } = {
  Aries: 'Ar',
  Taurus: 'Ta',
  Gemini: 'Ge',
  Cancer: 'Cn',
  Leo: 'Le',
  Virgo: 'Vi',
  Libra: 'Li',
  Scorpio: 'Sc',
  Sagittarius: 'Sg',
  Capricorn: 'Cp',
  Aquarius: 'Aq',
  Pisces: 'Pi',
};

/**
 * Revised LagnaChart:
 * - Computes house numbers the same way you did.
 * - Lays out the 12 houses on a circular wheel using absolute positions (reliable).
 * - Shows sign abbreviation and planets inside each house.
 */
const LagnaChart: React.FC<LagnaChartProps> = ({ ascendant, moonSign, sunSign }) => {
  const ascendantHouse = SIGN_NUMBERS[ascendant] || 1;

  // Calculate which house each planet is in (1..12 relative to ascendant)
  const getHouseForSign = (sign: string): number => {
    const signNumber = SIGN_NUMBERS[sign];
    if (!signNumber) return 1;
    let house = signNumber - ascendantHouse + 1;
    if (house <= 0) house += 12;
    return house;
  };

  const moonHouse = getHouseForSign(moonSign);
  const sunHouse = getHouseForSign(sunSign);

  // Get sign for a given house (house=1..12)
  const getSignForHouse = (house: number): string => {
    let signNumber = ascendantHouse + house - 1;
    // wrap 1..12
    signNumber = ((signNumber - 1 + 12) % 12) + 1;
    const signName = Object.keys(SIGN_NUMBERS).find((k) => SIGN_NUMBERS[k] === signNumber);
    return SIGN_ABBREVIATIONS[signName || ''] || '';
  };

  // Planets present in the house
  const getPlanetsInHouse = (house: number): string[] => {
    const planets: string[] = [];
    if (house === 1) planets.push('As'); // Ascendant mark in house 1
    if (house === moonHouse) planets.push('Mo');
    if (house === sunHouse) planets.push('Su');
    return planets;
  };

  // chart geometry
  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = 110;
  const HOUSE_BOX = 64; // box for each house
  const angleStep = (2 * Math.PI) / 12; // 12 houses

  // For each house 1..12 compute top/left for absolute placement
  const housePositions = Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    // We want house 1 at top center and then go clockwise.
    // Angle 0 points upward; rotate clockwise by angleStep each house.
    const theta = (i) * angleStep; // 0..2pi
    // Convert so 0 = up: sin/cos used accordingly
    const x = CENTER + RADIUS * Math.sin(theta) - HOUSE_BOX / 2;
    const y = CENTER - RADIUS * Math.cos(theta) - HOUSE_BOX / 2;
    return { house, left: x, top: y };
  });

  const renderHouseBox = (house: number) => {
    const sign = getSignForHouse(house);
    const planets = getPlanetsInHouse(house);
    const pos = housePositions[house - 1];

    const boxStyle: ViewStyle = {
      position: 'absolute',
      width: HOUSE_BOX,
      height: HOUSE_BOX,
      left: pos.left,
      top: pos.top,
    };

    return (
      <View key={house} style={[styles.house, boxStyle]}>
        <Text style={styles.houseNumber}>{house}</Text>
        <Text style={styles.signText}>{sign}</Text>
        {planets.length > 0 && (
          <View style={styles.planetsContainer}>
            {planets.map((p) => (
              <Text key={p} style={styles.planetText}>
                {p}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lagna Chart (Wheel version)</Text>

      <View style={[styles.chartContainer, { width: SIZE, height: SIZE }]}>
        {/* Outer circle */}
        <View style={[styles.circle, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]} />

        {/* center box */}
        <View style={[styles.centerBoxWheel, { left: CENTER - 48, top: CENTER - 24 }]}>
          <Text style={styles.centerText}>Rashi</Text>
          <Text style={styles.centerSubtext}>{ascendant}</Text>
        </View>

        {/* Houses */}
        {housePositions.map((p) => renderHouseBox(p.house))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendItem}>As = Ascendant (Lagna)</Text>
        <Text style={styles.legendItem}>Mo = Moon</Text>
        <Text style={styles.legendItem}>Su = Sun</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },

  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderRadius: 8,
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },

  centerBoxWheel: {
    position: 'absolute',
    width: 96,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  centerText: { fontSize: 13, fontWeight: '600', color: '#4338CA' },
  centerSubtext: { fontSize: 11, color: '#6366F1', fontWeight: '500' },

  house: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 6,
  },
  houseNumber: { position: 'absolute', top: 4, left: 6, fontSize: 9, color: '#9CA3AF', fontWeight: '700' },
  signText: { fontSize: 12, fontWeight: '600', color: '#6366F1', marginBottom: 4 },
  planetsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  planetText: { fontSize: 11, fontWeight: '700', color: '#DC2626', marginHorizontal: 2 },

  legend: { marginTop: 16, alignItems: 'center' },
  legendItem: { fontSize: 12, color: '#6B7280' },
});

export default LagnaChart;
