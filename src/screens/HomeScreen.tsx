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
        // Fetch weather data
        const weatherResp = await getWeatherForecast(LATITUDE, LONGITUDE, preferences.unit);
        const forecast = weatherResp.data;
        const currentTemp = forecast.list[0].main.temp;  // first forecast entry
        const desc = forecast.list[0].weather[0].description;
        setWeatherTemp(currentTemp);
        setWeatherDesc(desc);

        // Determine mood query based on temperature in Celsius
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

        // Fetch news for each selected category (or general if none)
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
      <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2', }}>
        <SkeletonPlaceholder borderRadius={4}>
          <View style={{ marginVertical: 20 }}>
            <View style={{ width: 200, height: 20, marginBottom: 6 }} />
            <View style={{ width: 150, height: 20 }} />
          </View>

          {[...Array(3)].map((_, idx) => (
            <View key={idx} style={{ marginBottom: 20 }}>
              <View style={{ width: '100%', height: 180, borderRadius: 8 }} />
              <View style={{ marginTop: 10, width: '90%', height: 20 }} />
              <View style={{ marginTop: 6, width: '80%', height: 20 }} />
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
    marginBottom: 20,
  },
  articleContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  articleDesc: {
    marginTop: 4,
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  flexcontainer: { backgroundColor: '#f2f2f2', padding: 10 },
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 10 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#0077b6' },
  card: { borderRadius: 10 },
  newsCard: { borderRadius: 10, backgroundColor: '#ffffff' },
  title: { fontSize: 16, fontWeight: '600' },
  link: { marginTop: 10, color: '#1e90ff' },

  weatherCard: {
  padding: 16,
  borderRadius: 12,
  backgroundColor: '#e0f7fa',
  marginBottom: 20,
  elevation: 3, // shadow for Android
  shadowColor: '#000', // shadow for iOS
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

weatherTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#00796b',
},

weatherText: {
  fontSize: 16,
  color: '#333',
},

newsHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#1e3a8a',
},

});
