import { View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, collection, onSnapshot, where, getDoc } from 'firebase/firestore';

//this is profile screen that is unique for every user
const ProfileScreen = () => {

  const [currentUser ,setCurrentUser] = useState([]);
  const [userPosts ,setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [active,setActive] = useState(0);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
    };

    const renderPostContent = () => {
        return (
            <View style={{paddingBottom:670}}>
                <ScrollView>
                {/* Display currentUser and userPosts data */}
                {userPosts.sort((a, b) => b.timestamp - a.timestamp).map((post, index) => (
                <View key={index} style={styles.postItem}>
                    <View style={{width:'15%', marginRight: '5%'}}>
                        <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
                    </View>
                    <View style={{width:'80%', marginTop: 8}}>
                        <View >
                            <Text style={{fontSize: 15, fontWeight: 600}}>{currentUser.name}</Text>
                            <Text style={{fontSize: 13, fontWeight: 200}}>{currentUser.email}</Text>
                            <Text>{post.timestamp.toDate().toLocaleString('en-US', options)}</Text>
                        </View>
                        <View style={{marginTop:5}}>
                            <Text >{post.text}</Text>
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
                ))}
                </ScrollView>
            </View>
            
        );
      };
      
      const renderListingContent = () => {
        return (
          <ScrollView>
            {/* Dummy listing data */}
            {[
              { title: "Listing 1", description: "Description for Listing 1" },
              { title: "Listing 2", description: "Description for Listing 2" },
              { title: "Listing 3", description: "Description for Listing 3" },
              { title: "Listing 4", description: "Description for Listing 4" }
            ].map((listing, index) => (
              <View key={index} style={styles.listingItem}>
                <Text style={styles.listingText}>{listing.title}</Text>
                <Text style={styles.listingDescription}>{listing.description}</Text>
                {/* Add any other listing-related information here */}
              </View>
            ))}
          </ScrollView>
        );
      };


    useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);
    
        const unsubscribe = onSnapshot(userRef, documentSnapshot => {
            if (documentSnapshot.exists()) {
                const userData = documentSnapshot.data(); // Get user data directly
                setCurrentUser(userData);
                setLoading(false);
            } else {
                // Handle case where user document doesn't exist
                console.log("User document does not exist");
            }
        });
    
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const postsRef = collection(FIREBASE_DB, 'posts');
        
        const unsubscribe = onSnapshot(postsRef, querySnapshot => {
          const userPosts = [];
          querySnapshot.forEach(doc => {
            const postData = doc.data();
            // Check if the post belongs to the currentUser
            if (postData.userId === currentUserUid) {
              userPosts.push({
                id: doc.id,
                ...postData
              });
            }
          });
          setUserPosts(userPosts);
          setLoading(false);
        });
        
        return () => unsubscribe();
      }, []);

    //   console.log(userPosts[0].id);

  return (
    <SafeAreaView>
        {/* <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Profile</Text> 
            </View>
        </View> */}
        {/* backgrounf image */}
        <View style={{width:"100%"}}>
            <Image source={require("../../assets/bg-image.jpeg")} style={styles.bgImage}></Image>
        </View>

        {/* avatar and button */}
        <View style={styles.avatarBtn}>
            <Image source={require("../../assets/profilePic.jpeg")} style={styles.avatar}></Image>
            <TouchableOpacity
                onPress={() => FIREBASE_AUTH.signOut()} title="Logout"
                style={styles.editBtn}>
                <Text style={{ fontWeight:"700", fontSize:14}}>Log Out</Text>
            </TouchableOpacity>     
            <TouchableOpacity style={styles.editBtn}>
                <Text onPress={handleEditProfile} style={{ fontWeight:"700", fontSize:14}}>Edit</Text>
            </TouchableOpacity>
        </View>

        {/* name, email, bio, following, followers */}
        <View style={{marginTop:10,marginHorizontal: 17}}>
            <Text style={{fontSize:17, fontWeight :900}}>{currentUser.name}</Text>
            <Text style={{fontSize:15, fontWeight :200, marginTop:3}}>{currentUser.email}</Text>
            <Text style={{fontSize:15, marginTop:6}}>
                {currentUser.bio}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10}}>
                <Text style={{fontSize:15, fontWeight :700}}>199</Text>
                <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
                <Text style={{fontSize:15, fontWeight :700, marginLeft:10}}>100.1K</Text>
                <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
            </View>
        </View>

        <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setActive(0)}
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 0 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17,}}>Post</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => setActive(1)} 
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 1 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17}}>Listing</Text>
            </TouchableOpacity>
        </View>
            {active === 0 && renderPostContent()}
            {active === 1 && renderListingContent()}    
    </SafeAreaView>




    // <View style={styles.container}>
    //   <Text className="text-xl">Hi, {userEmail} </Text>
    //   <Text>this is your profile page</Text>
    //   <TouchableOpacity 
    //     className="rounded-lg bg-black px-4 py-1 mt-2 w-60"
    //     onPress={() => FIREBASE_AUTH.signOut()} title="Logout">
    //     <Text className="color-white text-lg font-bold text-center">Log Out</Text>
    //   </TouchableOpacity>
    // </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    avatarBtn:{
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginTop:5,
    },
    titleContainer:{
      flex:1,
      justifyContent: "center",
      alignItems:"center",
      marginLeft: 70,
    },
    editBtn:{
      backgroundColor: "#529C4E",
      width: 70,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowOffset:{
          width: 0,
          height: 2,
      }
    },
    bgImage:{
        height:100,
        width: "100%"
    },
    avatar: {
        width:90,
        height:90,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
        marginTop: -50,
    },
    tabBar: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        justifyContent: "space-between",
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

export default ProfileScreen