// src/screens/SettingsScreen.tsx
import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { PreferencesContext, NEWS_CATEGORIES } from '../contexts/PreferencesContext';

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
            <Text style={styles.label}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});
