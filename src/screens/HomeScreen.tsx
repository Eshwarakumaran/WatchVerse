import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar';
import { ToggleTabs } from '../components/ToggleTabs';
import { MediaCard } from '../components/MediaCard';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MainStackParamList = {
  Home: undefined;
  Details: { item: any };
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

type TabType = 'tv' | 'anime';

interface MediaItem {
  id: number;
  title: string;
  poster: string;
  score: string;
  summary: string;
  type: 'tv' | 'anime';
  extra: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tv');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTVShows = async (query: string) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      const json = await response.json();
      
      const normalizedData: MediaItem[] = json.map((item: any) => ({
        id: item.show.id,
        title: item.show.name,
        poster: item.show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image',
        score: item.show.rating?.average ? item.show.rating.average.toFixed(1) : 'N/A',
        summary: item.show.summary?.replace(/<[^>]*>/g, '') || 'No summary available',
        type: 'tv',
        extra: {
          premiered: item.show.premiered,
          language: item.show.language,
          runtime: item.show.runtime,
          genres: item.show.genres,
        },
      }));
      
      setData(normalizedData);
      setError(null);
    } catch {
      setError('Failed to fetch TV shows');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnime = async (query: string) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
      const json = await response.json();
      
      const normalizedData: MediaItem[] = json.data.map((item: any) => ({
        id: item.mal_id,
        title: item.title,
        poster: item.images?.jpg?.image_url || 'https://via.placeholder.com/210x295?text=No+Image',
        score: item.score ? item.score.toFixed(1) : 'N/A',
        summary: item.synopsis || 'No synopsis available',
        type: 'anime',
        extra: {
          episodes: item.episodes,
          status: item.status,
          season: item.season,
          genres: item.genres?.map((g: any) => g.name) || [],
        },
      }));
      
      setData(normalizedData);
      setError(null);
    } catch {
      setError('Failed to fetch anime');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      if (activeTab === 'tv') {
        fetchTVShows(searchQuery);
      } else {
        fetchAnime(searchQuery);
      }
    } else {
      setData([]);
    }
  }, [searchQuery, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>WatchVerse</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${activeTab === 'tv' ? 'TV shows' : 'anime'}...`}
        />
        <ToggleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : data.length === 0 && searchQuery.trim() ? (
          <Text style={styles.empty}>No results found</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MediaCard
                item={item}
                onPress={() => navigation.navigate('Details', { item })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
