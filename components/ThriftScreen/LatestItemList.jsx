import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import ListingItem from './ListingItem'

export default function LatestItemList({latestItemList, heading, getMoreItems, onRefresh, refreshing}) {
  console.log("latestItemList",latestItemList)
  const [refresh, setRefresh] = useState(false);
  return (
    <View style={styles.container}>
      {heading !== ""? <Text style={styles.listingHeaderTxt}>{heading}</Text> : null }
      <FlatList
        data={latestItemList}
        numColumns={2}
        onEndReached={getMoreItems}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        renderItem={({item,index})=>(
          <View style={{ width: '50%', padding: 0 }}>
            <ListingItem item={item}/>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginTop:10,
    },
    listingHeaderTxt:{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
})