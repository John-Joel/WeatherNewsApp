import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { PreferencesContext, NEWS_CATEGORIES } from '../contexts/PreferencesContext';
import { scale, verticalScale, moderateScale, wp, hp } from '../utils/responsive';

export const SettingsScreen = () => {
  const prefsContext = useContext(PreferencesContext);
  if (!prefsContext) return null;
  const { preferences, updateUnit, toggleCategory } = prefsContext;

  const isMetric = preferences.unit === 'metric';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionHeader}>Temperature Unit:</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Imperial (°F)</Text>
        <Switch
          value={isMetric}
          onValueChange={() => updateUnit(isMetric ? 'imperial' : 'metric')}
        />
        <Text style={styles.label}>Metric (°C)</Text>
      </View>

      <Text style={styles.sectionHeader}>News Categories:</Text>
      {NEWS_CATEGORIES.map(cat => {
        const isSelected = preferences.categories.includes(cat);
        return (
          <View key={cat} style={styles.row}>
            <Switch
              value={isSelected}
              onValueChange={() => toggleCategory(cat)}
            />
            <Text style={styles.label}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(32),
  },
  sectionHeader: {
    fontSize: moderateScale(18),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  label: {
    fontSize: moderateScale(16),
    marginHorizontal: scale(8),
  },
});
