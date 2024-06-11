import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function Categories({categoryList}) {

  const navigation = useNavigation();
  const handleCatItemList = (categoryData) => {
    navigation.navigate('CatItemListScreen',{categoryData});
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.catHeaderTxt}>Categories</Text>
      <FlatList
        data={categoryList}
        numColumns={3}
        renderItem={({item, index}) => (
            <TouchableOpacity style={styles.catContainer} onPress={() => handleCatItemList(item)}>
                <Image source={{uri:item.image}}
                    style={styles.catImage}
                />
                <Text>{item.name}</Text>
            </TouchableOpacity>
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
    catHeaderTxt:{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        
    },
    catContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 20,
        // borderWidth:1,
        backgroundColor: 'white',
        borderColor:'#ccc',
        borderRadius: 10,
        margin: 5,
        height: 75,
        elevation: 3,

        
    },
    catImage:{
        height: 50,
        width: 50,
    }
})