import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import PostItem from './PostItem'

export default function LatestPostList({latestPostList, heading, updatePostList}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={latestPostList}
        renderItem={({item,index})=>(
            <PostItem item={item} updatePostList={updatePostList}/>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
      paddingBottom: 150,
    },
})