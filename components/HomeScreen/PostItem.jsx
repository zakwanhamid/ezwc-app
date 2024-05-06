import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function PostItem({item}) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
  const navigation = useNavigation();

    const handleItemDetails = (item) => {
        navigation.navigate('ListingDetailsScreen',{product: item});
    };


  return (
      <View style={styles.postItem}>
          <View style={{width:'15%', marginRight: '5%'}}>
              <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
          </View>
          <View style={{width:'80%', marginTop: 8}}>
              <View >
                  <Text style={{fontSize: 15, fontWeight: 600}}>{item.userName}</Text>
                  <Text style={{fontSize: 13, fontWeight: 200}}>{item.userEmail}</Text>
                  <Text>{item.timestamp.toDate().toLocaleString('en-US', options)}</Text>
                  
              </View>
              <View style={{marginTop:5}}>
                  <Text >{item.text}</Text>
              </View>
              <View style={styles.postImagesContainer}>
                  {item.images.map((imageUri, index) => (
                      <Image source={{ uri: imageUri }} style={styles.postImages} />
                  ))}
              </View>
          </View>
      </View>
              
  )
}

const styles = StyleSheet.create({
  postItem: {
    flexDirection: "row",
    padding: 7,
    paddingHorizontal: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  postAvatar: {
    width: 60,
    height:60,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 2,
  },
  postImagesContainer:{
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  postImages:{
    width:150,
    height:100,
    borderRadius: 8,
    marginBottom:10
  }

})