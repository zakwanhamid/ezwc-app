import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfileScreen = ({ route }) => {
  const [user ,setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPosts ,setUserPosts] = useState([]);
  const [active,setActive] = useState(0);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
  const navigation = useNavigation();
  const {userId} = route.params;
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const userRef = doc(collection(FIREBASE_DB, 'users'), userId);

    const unsubscribe = onSnapshot(userRef, documentSnapshot => {
        if (documentSnapshot.exists()) {
            const userData = documentSnapshot.data(); // Get user data directly
            setUser(userData);
            setLoading(false);
        } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
        }
    });

    return () => unsubscribe();
  }, []);

//   useEffect(() => {
//     const postsRef = collection(FIREBASE_DB, 'posts');
    
//     const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
//       const userPostsData = [];
//       querySnapshot.forEach((doc) => {
//         const postData = doc.data();

//         // Check if the post belongs to the currentUser
//         if (postData.userId === userId) {
//           userPostsData.push({
//             id: doc.id,
//             images: postData.images,
//             text: postData.text,
//             timestamp: postData.timestamp,
//           });
//         }
//       });

//       setUserPosts(userPostsData);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [userId]);

const renderPostContent = () => {
    return (
        <View style={{paddingBottom:750}}>
            <ScrollView>
            {/* Display currentUser and userPosts data */}
            {userPosts.sort((a, b) => b.timestamp - a.timestamp).map((post, index) => (
            <View key={index} style={styles.postItem}>
                <View style={{width:'15%', marginRight: '5%'}}>
                    <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
                </View>
                <View style={{width:'80%', marginTop: 8}}>
                    <View >
                        <Text style={{fontSize: 15, fontWeight: 600}}>{user.name}</Text>
                        <Text style={{fontSize: 13, fontWeight: 200}}>{user.email}</Text>
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

useEffect(() => {
    const postsRef = collection(FIREBASE_DB, 'posts');
    
    const unsubscribe = onSnapshot(postsRef, querySnapshot => {
      const userPost = [];
      querySnapshot.forEach(doc => {
        const postData = doc.data();
        // Check if the post belongs to the currentUser
        if (postData.userId === userId) {
          userPost.push({
            id: doc.id,
            ...postData
          });
        }
      });
      setUserPosts(userPost);
      setLoading(false);
    });
    
    return () => unsubscribe();
}, []);


  

  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>{user.name}</Text> 
            </View>
        </View>

        <View style={{width:"100%"}}>
            <Image source={require("../../assets/bg-image.jpeg")} style={styles.bgImage}></Image>
        </View>

        {/* avatar and button */}
        <View style={styles.avatarBtn}>
            <Image source={require("../../assets/profilePic.jpeg")} style={styles.avatar}></Image>
            <TouchableOpacity style={styles.editBtn}>
                <Text style={{ fontWeight:"700", fontSize:14}}>Follow</Text>
            </TouchableOpacity>
        </View>

        {/* name, email, bio, following, followers */}
        <View style={{marginTop:10,marginHorizontal: 17}}>
            <Text style={{fontSize:17, fontWeight :900}}>{user.name}</Text>
            <Text style={{fontSize:15, fontWeight :200, marginTop:3}}>{user.email}</Text>
            <Text style={{fontSize:15, marginTop:6}}>
                {user.bio}
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
            {/* {active === 1 && renderListingContent()}  */}
    </SafeAreaView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth:1,
        borderBottomColor: "#D8D9DB",
      },
    titleContainer:{
        flex:1,
        justifyContent: "center",
        alignItems:"center",
        marginLeft: -9,
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
    avatarBtn:{
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginTop:5,
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