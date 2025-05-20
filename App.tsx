import 'react-native-gesture-handler';
import React from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen, homeScreenOptions } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import AnimatedTitle from './src/components/AnimatedTitle';
export type RootStackParamList = {
  SplashScreen: undefined;
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
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerTitle: () => <AnimatedTitle />,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}
                  style={{ paddingRight: 15 }}
                >
                  <Ionicons name="settings-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerTitle: () => <AnimatedTitle />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PreferencesProvider>
  );
};

export default App;
