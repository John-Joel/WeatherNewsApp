import axios from 'axios';

const NEWS_API_KEY = '11d15f1c9e5c41b8ab56cfb5ae81b673';

export const getNewsHeadlines = async (category: string, query: string) => {
  const url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}` +
              `&category=${category}`;
  const response = await axios.get(url);
  return response.data.articles;
};