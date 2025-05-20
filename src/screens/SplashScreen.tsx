// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/Animation - 1747742005440.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.logo}>☁️ Weather & News</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0077b6',
  },
    lottie: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
