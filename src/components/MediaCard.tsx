import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWatchlist } from '../context/WatchlistContext';

interface MediaCardProps {
  item: {
    id: number;
    title: string;
    poster: string;
    score: string;
    summary: string;
    type: 'tv' | 'anime';
    extra: any;
  };
  onPress: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const inWatchlist = isInWatchlist(item.id);

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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { flex: 1 }]} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={toggleWatchlist} style={styles.watchlistBtn}>
            <Icon 
              name={inWatchlist ? "heart" : "heart-outline"} 
              size={22} 
              color={inWatchlist ? "#ef4444" : "#888"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>⭐ {item.score}</Text>
        </View>
        <Text style={styles.summary} numberOfLines={3}>
          {item.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
  },
  poster: {
    width: 100,
    height: 150,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  watchlistBtn: {
    padding: 4,
  },
  scoreContainer: {
    marginBottom: 8,
  },
  score: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
});
