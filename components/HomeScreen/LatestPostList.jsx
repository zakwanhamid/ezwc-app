import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import PostItem from './PostItem';

export default function LatestPostList({ latestPostList, heading, updatePostList, refreshing, onRefresh }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={latestPostList}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <PostItem item={item} updatePostList={updatePostList} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
