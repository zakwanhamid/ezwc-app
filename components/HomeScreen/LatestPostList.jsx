import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import PostItem from './PostItem'

export default function LatestPostList({latestPostList, heading}) {
    console.log('latestPSToList:',latestPostList)
  return (
    <View style={styles.container}>
      <Text style={styles.listingHeaderTxt}>{heading}</Text>
      <FlatList
        data={latestPostList}
        renderItem={({item,index})=>(
            <PostItem item={item}/>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
    },
    listingHeaderTxt:{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
})