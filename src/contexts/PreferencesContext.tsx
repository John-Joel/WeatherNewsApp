// src/contexts/PreferencesContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UnitType = 'metric' | 'imperial';
export const NEWS_CATEGORIES = [
  'business','entertainment','general','health','science','sports','technology'
];

interface Preferences {
  unit: UnitType;
  categories: string[];
}

interface PreferencesContextType {
  preferences: Preferences;
  updateUnit: (unit: UnitType) => void;
  toggleCategory: (category: string) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    unit: 'metric',
    categories: [],
  });

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('preferences').then(value => {
      if (value) {
        setPreferences(JSON.parse(value));
      }
    });
  }, []);

  // Update AsyncStorage whenever preferences change
  const savePreferences = async (newPrefs: Preferences) => {
    setPreferences(newPrefs);
    await AsyncStorage.setItem('preferences', JSON.stringify(newPrefs));
  };

  const updateUnit = (unit: UnitType) => {
    savePreferences({ ...preferences, unit });
  };

  const toggleCategory = (category: string) => {
    const isSelected = preferences.categories.includes(category);
    const newCategories = isSelected
      ? preferences.categories.filter(cat => cat !== category)
      : [...preferences.categories, category];
    savePreferences({ ...preferences, categories: newCategories });
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updateUnit, toggleCategory }}>
      {children}
    </PreferencesContext.Provider>
  );
};
