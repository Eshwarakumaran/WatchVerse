import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWatchlist } from '../context/WatchlistContext';

type MainStackParamList = {
  Home: undefined;
  Details: { item: any };
  Profile: undefined;
};

type DetailsScreenProps = NativeStackScreenProps<MainStackParamList, 'Details'>;

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { item } = route.params;
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(item.id);
  const [cast, setCast] = useState<any[]>([]);
  const [loadingCast, setLoadingCast] = useState(false);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({
        id: item.id,
        title: item.title,
        poster: item.poster,
        score: item.score,
        summary: item.summary,
        type: item.type,
        extra: item.extra,
      });
    }
  };

  const openTrailer = () => {
    const searchQuery = encodeURIComponent(`${item.title} trailer`);
    Linking.openURL(`https://www.youtube.com/results?search_query=${searchQuery}`);
  };

  useEffect(() => {
    if (item.type === 'tv') {
      // TVmaze has a cast endpoint
      const fetchCast = async () => {
        try {
          setLoadingCast(true);
          const response = await fetch(`https://api.tvmaze.com/shows/${item.id}/cast`);
          const json = await response.json();
          setCast(json);
        } catch (e) {
          console.error('Failed to fetch cast', e);
        } finally {
          setLoadingCast(false);
        }
      };
      fetchCast();
    } else if (item.type === 'anime') {
      // Jikan API has cast endpoint
      const fetchCast = async () => {
        try {
          setLoadingCast(true);
          const response = await fetch(`https://api.jikan.moe/v4/anime/${item.id}/characters`);
          const json = await response.json();
          setCast(json.data);
        } catch (e) {
          console.error('Failed to fetch cast', e);
        } finally {
          setLoadingCast(false);
        }
      };
      fetchCast();
    }
  }, [item.id, item.type]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity onPress={toggleWatchlist} style={styles.watchlistBtn}>
              <Icon 
                name={inWatchlist ? "heart" : "heart-outline"} 
                size={28} 
                color={inWatchlist ? "#ef4444" : "#888"} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.score}>⭐ {item.score}</Text>
          
          {item.extra?.genres && item.extra.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {item.extra.genres.map((genre: string, index: number) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.trailerBtn} onPress={openTrailer}>
            <Icon name="play-circle-outline" size={24} color="#fff" />
            <Text style={styles.trailerBtnText}>Watch Trailer</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{item.summary}</Text>

          <View style={styles.infoContainer}>
            {item.extra?.premiered && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Premiered</Text>
                <Text style={styles.infoValue}>{item.extra.premiered}</Text>
              </View>
            )}
            {item.extra?.language && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Language</Text>
                <Text style={styles.infoValue}>{item.extra.language}</Text>
              </View>
            )}
            {item.extra?.runtime && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Runtime</Text>
                <Text style={styles.infoValue}>{item.extra.runtime} min</Text>
              </View>
            )}
            {item.extra?.episodes && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Episodes</Text>
                <Text style={styles.infoValue}>{item.extra.episodes}</Text>
              </View>
            )}
            {item.extra?.status && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{item.extra.status}</Text>
              </View>
            )}
            {item.extra?.season && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Season</Text>
                <Text style={styles.infoValue}>{item.extra.season}</Text>
              </View>
            )}
          </View>

          {loadingCast ? (
            <ActivityIndicator size="small" color="#6366f1" style={styles.castLoader} />
          ) : cast.length > 0 ? (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                data={cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(castItem, index) => index.toString()}
                renderItem={({ item: castItem }) => {
                  let name = '';
                  let image = 'https://via.placeholder.com/100x140?text=No+Image';
                  let character = '';

                  if (item.type === 'tv') {
                    name = castItem.person?.name || '';
                    image = castItem.person?.image?.medium || 'https://via.placeholder.com/100x140?text=No+Image';
                    character = castItem.character?.name || '';
                  } else if (item.type === 'anime') {
                    name = castItem.voice_actors?.[0]?.person?.name || '';
                    image = castItem.voice_actors?.[0]?.person?.images?.jpg?.image_url || 'https://via.placeholder.com/100x140?text=No+Image';
                    character = castItem.character?.name || '';
                  }

                  return (
                    <View style={styles.castCard}>
                      <Image
                        source={{ uri: image }}
                        style={styles.castImage}
                      />
                      <Text style={styles.castName} numberOfLines={1}>{name}</Text>
                      <Text style={styles.castCharacter} numberOfLines={1}>{character}</Text>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  poster: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  watchlistBtn: {
    padding: 4,
  },
  score: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreTag: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
  },
  trailerBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
  },
  trailerBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  summary: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  infoContainer: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    color: '#888',
    fontSize: 16,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  castSection: {
    marginTop: 30,
  },
  castLoader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  castCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 100,
  },
  castImage: {
    width: 100,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  castName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  castCharacter: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});
