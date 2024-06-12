import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function ListingItem({item}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

    const handleItemDetails = (item) => {
        navigation.navigate('ListingDetailsScreen',{product: item});
    };


  return (
    <TouchableOpacity style={styles.listContainer} 
        onPress={() => handleItemDetails(item)}
    >
        <View>
        <Image
          source={{ uri: item.image }}
          style={styles.postImg}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#529C4E" />
          </View>
        )}
      </View>
        <View style={styles.detailsContainer}>
            <Text style={styles.catTxt}>{item.category}</Text>
            <Text style={styles.titleTxt}>{item.title}</Text>
            <Text style={styles.priceTxt}>RM {item.price}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    listContainer:{
        margin:5,
        flex:1,
        padding:1,
        borderRadius: 5,
        borderWidth:1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        elevation:2,
    },
    postImg:{
        width: '100%',
        height: 150,
        borderRadius: 5,
    },
    detailsContainer:{
        padding:5
    },
    catTxt: {
        color: '#808080'
    },
    titleTxt:{
        fontSize: 15,
        fontWeight: '600',
        marginTop: 5,
    },
    priceTxt:{
        fontSize:20,
        fontWeight: '700',
        color: '#529C4E'
    },
    loadingIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: add a semi-transparent background
      },
})