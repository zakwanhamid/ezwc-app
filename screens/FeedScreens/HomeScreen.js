import { View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image, TextInput, ScrollView } from 'react-native'
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

      <View style={{paddingBottom: 120}}>
      <ScrollView>
      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View>
              
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/mrcrab.png")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/patrick.png")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/plankton.png")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/sidney.png")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.postItem}>
        <View style={{width:'15%', marginRight: '5%'}}>
            <Image source={require("../../assets/squid.png")} style={styles.postAvatar}></Image>
        </View>
        <View style={{width:'80%', marginTop: 8}}>
            <View >
                <Text style={{fontSize: 15, fontWeight: 600}}>Ahmad SpongeBob</Text>
                <Text style={{fontSize: 13, fontWeight: 200}}>spongebob@usm.my</Text>
                <Text>11/11/2024, 12:12 PM </Text>
            </View>
            <View style={{marginTop:5}}>
                <Text >This is so new</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>

      </ScrollView>
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
  postItem: {
    flexDirection: "row",
    paddingTop: 7,
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

  button: {
      width: "50%", 
      alignItems: "center",
      padding: 10,
      borderBottomColor: "#529C4E"
  },

  buttonText: {
      fontSize: 16,
      marginLeft: 8,
  },
})

export default HomeScreen;