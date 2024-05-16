import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ListingItem from './ListingItem'

export default function LatestItemList({latestItemList, heading}) {
  console.log("latestItemList",latestItemList)
  const [refresh, setRefresh] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.listingHeaderTxt}>{heading}</Text>
      <FlatList
        data={latestItemList}
        numColumns={2}
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