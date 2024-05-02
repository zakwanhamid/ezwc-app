import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function Slider({sliderList}) {
  return (
    <View style={{paddingHorizontal:20, marginTop:10}}>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index})=>(
            <View>
                <Image source={{uri:item?.image}}
                    style={styles.slideImages}
                />
            </View>
        )}        
      />
    </View>
  )
}
const styles = StyleSheet.create({
    slideImages:{
        height: 150,
        width: 330,
        marginRight: 20,
        borderRadius: 20

    }
})