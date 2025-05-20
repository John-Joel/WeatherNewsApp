// src/screens/HomeScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { getWeatherForecast } from '../services/WeatherService';
import { getNewsHeadlines } from '../services/NewsService';

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
          : (currentTemp - 32) * (5/9);
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Loading weather and news...</Text>
      </View>
    );
  }

  const displayTemp = weatherTemp !== null ? 
    `${weatherTemp.toFixed(1)}°${preferences.unit === 'metric' ? 'C' : 'F'}` 
    : '--';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherText}>Current Temperature: {displayTemp}</Text>
        <Text style={styles.weatherText}>Condition: {weatherDesc}</Text>
      </View>
      <Text style={styles.newsHeader}>News Headlines:</Text>
      {newsArticles.map((article, index) => (
        <View key={index} style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          {article.description ? (
            <Text style={styles.articleDesc}>{article.description}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

export const homeScreenOptions = ({ navigation }: any) => ({
  title: 'Home',
  headerRight: () => (
    <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
  ),
});

const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
  weatherContainer: {
    marginBottom: 20,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 4,
  },
  newsHeader: {
    fontSize: 20,
    marginBottom: 10,
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

  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 10 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#0077b6' },
  card: { borderRadius: 10 },
  newsCard: { borderRadius: 10, backgroundColor: '#ffffff' },
  title: { fontSize: 16, fontWeight: '600' },
  link: { marginTop: 10, color: '#1e90ff' },
});
