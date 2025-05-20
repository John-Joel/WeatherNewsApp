// App.tsx
import 'react-native-gesture-handler';  // needed for React Navigation
import React from 'react';
import { Button } from 'react-native';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, homeScreenOptions } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <PreferencesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              title: 'Home',
              headerRight: () => (
                <Button 
                  title="Settings" 
                  onPress={() => navigation.navigate('Settings')} 
                />
              ),
            })}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesProvider>
  );
};

export default App;
