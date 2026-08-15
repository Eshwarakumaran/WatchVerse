import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type TabType = 'tv' | 'anime';

interface ToggleTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ToggleTabs: React.FC<ToggleTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'tv' && styles.activeTab]}
        onPress={() => onTabChange('tv')}
      >
        <Text style={[styles.tabText, activeTab === 'tv' && styles.activeTabText]}>
          TV Shows
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'anime' && styles.activeTab]}
        onPress={() => onTabChange('anime')}
      >
        <Text style={[styles.tabText, activeTab === 'anime' && styles.activeTabText]}>
          Anime
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
