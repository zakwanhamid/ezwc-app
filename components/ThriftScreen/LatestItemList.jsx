import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ListingItem from './ListingItem'

export default function LatestItemList({latestItemList}) {
  return (
    <View style={styles.container}>
      <Text style={styles.listingHeaderTxt}>Latest Item</Text>
      <FlatList
        data={latestItemList}
        numColumns={2}
        renderItem={({item,index})=>(
            <ListingItem item={item}/>
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