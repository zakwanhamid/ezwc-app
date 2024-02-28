import { View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../firebase';
import { AntDesign, Ionicons } from '@expo/vector-icons';

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const handleCreatePost = () => {
    navigation.navigate('CreatePostScreen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //-----not goin to use YET, no yet retrieve data----
  // const [userEmail ,setUserEmail] = useState(null);
  // useEffect(() => {
  //   const currentUser = FIREBASE_AUTH.currentUser;
  //   if (currentUser) {
  //     setUserEmail(currentUser.email);
  //   }
  // }, []);
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight:"600"}}>Feed</Text> 
        </View>
        <TouchableOpacity onPress={handleCreatePost} style={styles.createBtn}>
          {/* <Text style={{ fontWeight:"500"}}>+ </Text> */}
          <AntDesign name="pluscircleo" size={24} color="#529C4E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Image source={require("../assets/eZWC@USM-logo.png")} style={styles.avatar}></Image>
        <TextInput
          autoFocus={true}
          multiline={true}
          numberOfLines={4}
          style={{ flex: 1}}
          placeholder='Want to share something?'
        >
        </TextInput>
      </View>


    </SafeAreaView>
    // <View style={styles.container}>
    //   <Text>Welcome to Home Screen</Text>
      
    // </View>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth:1,
    borderBottomColor: "#D8D9DB"
  },
  titleContainer:{
    flex:1,
    justifyContent: "center",
    alignItems:"center",
    marginLeft: 50,
  },
  body:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createBtn:{
    // backgroundColor: "#529C4E",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer:{
    margin: 32,
    flexDirection: "row"
  },
  avatar: {
    width:48,
    height:48,
    borderRadius
  }
})

export default HomeScreen;