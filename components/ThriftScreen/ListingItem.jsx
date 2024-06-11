import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function ListingItem({item}) {
  const navigation = useNavigation();

    const handleItemDetails = (item) => {
        navigation.navigate('ListingDetailsScreen',{product: item});
    };


  return (
    <TouchableOpacity style={styles.listContainer} 
        onPress={() => handleItemDetails(item)}
    >
        <Image source = {{uri:item.image}}
            style={styles.postImg}
        />
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
    }
})