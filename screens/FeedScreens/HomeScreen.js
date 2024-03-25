import { View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../firebase';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const handleCreatePost = () => {
    navigation.navigate('CreatePostScreen');
  };
  const handleProfileSearch = () => {
    navigation.navigate('ProfileSearchScreen');
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
        <TouchableOpacity onPress={handleProfileSearch}>
        <FontAwesome name="search" size={22} color="#529C4E" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight:"600"}}>Feed</Text> 
        </View>
        <TouchableOpacity onPress={handleCreatePost}>
          <AntDesign name="pluscircleo" size={24} color="#529C4E" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text>This is HomeScreen</Text>
        <Text>You can view all post from your following here</Text>
      </View>


    </SafeAreaView>
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
    marginLeft: 10,
  },
  body:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default HomeScreen;