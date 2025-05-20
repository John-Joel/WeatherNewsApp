// src/screens/HomeScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { getWeatherForecast } from '../services/WeatherService';
import { getNewsHeadlines } from '../services/NewsService';
import { Card } from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
const LATITUDE = 51.5074;   // Example: London
const LONGITUDE = -0.1278;
import { scale, verticalScale, moderateScale, wp, hp } from '../utils/responsive';

export const HomeScreen = ({ navigation }: any) => {
  const prefsContext = useContext(PreferencesContext);
  if (!prefsContext) return null;
  const { preferences } = prefsContext;
  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [weatherDesc, setWeatherDesc] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const weatherResp = await getWeatherForecast(LATITUDE, LONGITUDE, preferences.unit);
        const forecast = weatherResp.data;
        const currentTemp = forecast.list[0].main.temp;
        const desc = forecast.list[0].weather[0].description;
        setWeatherTemp(currentTemp);
        setWeatherDesc(desc);
        const tempC = preferences.unit === 'metric'
          ? currentTemp
          : (currentTemp - 32) * (5 / 9);
        let moodQuery = '';
        if (tempC < 15) {
          moodQuery = 'sad OR depressing';
        } else if (tempC > 30) {
          moodQuery = 'fear OR disaster';
        } else {
          moodQuery = 'happy OR success';
        }

        let articles: any[] = [];
        const categories = preferences.categories.length > 0
          ? preferences.categories
          : ['general'];
        for (const cat of categories) {
          const newArticles = await getNewsHeadlines(cat, moodQuery);
          articles = articles.concat(newArticles);
        }
        setNewsArticles(articles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [preferences]);


  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#fff' }}>
      <SkeletonPlaceholder
        borderRadius={4}
        backgroundColor="#eaeaea"
        highlightColor="#f5f5f5"
      >
          <View style={{ marginVertical: verticalScale(20) }}>
            <View style={{ width: wp('50%'), height: verticalScale(20), marginBottom: verticalScale(6) }} />
            <View style={{ width: wp('40%'), height: verticalScale(20) }} />
          </View>

          {[...Array(3)].map((_, idx) => (
            <View key={idx} style={{ marginBottom: verticalScale(20) }}>
              <View style={{ width: '100%', height: verticalScale(180), borderRadius: scale(8) }} />
              <View style={{ marginTop: verticalScale(10), width: '90%', height: verticalScale(20) }} />
              <View style={{ marginTop: verticalScale(6), width: '80%', height: verticalScale(20) }} />
            </View>
          ))}
        </SkeletonPlaceholder>
      </ScrollView>
    );
  }

  const displayTemp = weatherTemp !== null ?
    `${weatherTemp.toFixed(1)}°${preferences.unit === 'metric' ? 'C' : 'F'}`
    : '--';

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>🌤️ Today's Weather</Text>
            <Text style={styles.weatherText}>Temperature: {displayTemp}</Text>
            <Text style={styles.weatherText}>Condition: {weatherDesc}</Text>
          </LinearGradient>
        </>
      }
      data={newsArticles}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 20 }}>
          {item.urlToImage && (
            <Card.Image
              source={{ uri: item.urlToImage }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <View style={styles.articleContainer}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            {item.description ? (
              <Text style={styles.articleDesc}>{item.description}</Text>
            ) : null}
          </View>
        </View>
      )}
      contentContainerStyle={styles.flexcontainer}
    />
  );
};

export const homeScreenOptions = ({ navigation }: any) => ({
  title: 'Home',
  headerRight: () => (
    <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
  ),
});

const styles = StyleSheet.create({
  weatherContainer: {
    marginBottom: verticalScale(20),
  },
  articleContainer: {
    marginBottom: verticalScale(12),
    padding: scale(8),
    backgroundColor: '#f0f0f0',
    borderRadius: scale(6),
  },
  articleTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  articleDesc: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(14),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: verticalScale(180),
    borderRadius: scale(8),
    marginBottom: verticalScale(10),
  },
  flexcontainer: {
    backgroundColor: '#f2f2f2',
    padding: scale(10),
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: scale(10),
  },
  header: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginVertical: verticalScale(10),
    color: '#0077b6',
  },
  card: {
    borderRadius: scale(10),
  },
  newsCard: {
    borderRadius: scale(10),
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  link: {
    marginTop: verticalScale(10),
    color: '#1e90ff',
  },

  weatherCard: {
    padding: scale(16),
    borderRadius: scale(12),
    backgroundColor: '#e0f7fa',
    marginBottom: verticalScale(20),
    elevation: 3, // shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  weatherTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    color: '#00796b',
  },

  weatherText: {
    fontSize: moderateScale(16),
    color: '#333',
  },

  newsHeader: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    color: '#1e3a8a',
  },
});

