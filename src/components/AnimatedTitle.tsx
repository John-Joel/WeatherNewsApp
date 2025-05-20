import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const AnimatedTitle = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/Animation - 1747743951518.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.logoText}>WeatherNewApp</Text>
    </View>
  );
};

export default AnimatedTitle;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(10),
  },
  lottie: {
    height: verticalScale(40),
    width: verticalScale(40),
  },
  logoText: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#0077b6',
  },
});
