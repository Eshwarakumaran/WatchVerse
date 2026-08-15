import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaCard } from '../components/MediaCard';
import { useWatchlist } from '../context/WatchlistContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WatchlistStackParamList = {
  WatchlistHome: undefined;
  Details: { item: any };
};

type WatchlistScreenNavigationProp = NativeStackNavigationProp<WatchlistStackParamList, 'WatchlistHome'>;

interface Props {
  navigation: WatchlistScreenNavigationProp;
}


export const WatchlistScreen: React.FC<Props> = ({ navigation }) => {
  const { watchlist } = useWatchlist();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>My Watchlist</Text>
        {watchlist.length === 0 ? (
          <Text style={styles.emptyText}>Your watchlist is empty!</Text>
        ) : (
          <FlatList
            data={watchlist}
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
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
