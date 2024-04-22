import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

export default function BinListView({data}) {
    const flatListRef = useRef(null);
  const {selectedMarker,setSelectedMarker}=useContext(SelectMarkerContext);


    useEffect(()=>{
        selectedMarker&&scrollToIndex(selectedMarker)
     },[selectedMarker]) 
   
   
     const scrollToIndex=(index)=>{
       flatListRef.current?.scrollToIndex({animated:true,index})
     }

  return (
    <View>
      <FlatList 
        data={data} 
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Dimensions.get('window').width * 0.01 }}
        renderItem={({item}) => (
        <View
            style={{
                backgroundColor: 'white',
                width: Dimensions.get('window').width,
                margin: 5,
                borderRadius: 10
                }}>
            
            <View style={{padding: 15, position: 'relative'}}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>

                <View style={{marginTop:5}}>
                    <Text style={{color: 'gray', fontSize: 17}}>No. of Bin Available</Text>
                    <Text style={{marginTop:2, fontSize: 20, fontWeight: 600}}>{item.binNum}</Text>
                </View>
                <TouchableOpacity>
                    <View style={styles.locationArrow}>
                        <FontAwesome name="location-arrow" size={25} color="white"/>
                    </View>
                </TouchableOpacity>
            </View>
            

        </View>
      )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemTitle: {
        fontSize: 23,
        fontWeight: '800',
    },
    itemDescription: {
        color: 'gray',
        fontSize: 14,
    },
    locationArrow: {
        padding: 12,
        backgroundColor: "#529C4E",
        borderRadius: 6,
        paddingHorizontal: 16,
        width: 55,
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 10,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Adjust the height of the gradient as needed
    },
  });