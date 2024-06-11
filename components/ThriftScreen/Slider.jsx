import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function Slider({sliderList}) {
  return (
    <View style={{}}>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index})=>(
            <View style={styles.sliderContainer}>
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
    sliderContainer:{
      backgroundColor:'white',
      elevation: 5,
      borderRadius: 20,
      marginLeft: 20,
      marginVertical: 10,
      
    },
    slideImages:{
      height: 150,
      width: 330,
      borderRadius: 20,

    }
})