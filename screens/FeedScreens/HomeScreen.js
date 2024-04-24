import { View, Text, TouchableOpacity, Button, StyleSheet, Image, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser ,setCurrentUser] = useState([]);
  const [mergedData ,setMergedData] = useState([]);
  // const [followingUser ,setFollowingUser] = useState([]);
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };


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

  

  // const fetchFollowingPosts = async () => {
  //   try {
  //     // Assuming you have the followingUsers array with user IDs in state
  //     const followingUsers = currentUser.following; // Sample user IDs
  //     console.log(followingUsers)
  //     const followingPostsPromises = followingUsers.map(async (followingUserId) => {
  //       const postsQuery = query(collection(FIREBASE_DB, 'posts'), where('userId', '==', followingUserId));
  //       const querySnapshot = await getDocs(postsQuery);
        
  //       const followingUserPosts = [];
  //       querySnapshot.forEach((doc) => {
  //         followingUserPosts.push({ id: doc.id, ...doc.data() });
  //       });
  //       console.log('following user posts',followingUserPosts)
  //       return followingUserPosts;
        
  //     });

  //     const followingPosts = await Promise.all(followingPostsPromises);
  //     const mergedPosts = followingPosts.flat(); // Merge arrays of posts into one array
  //     console.log('merged posts:', mergedPosts)
  //     setFollowingUserPosts(mergedPosts);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching following user posts:', error);
  //     setLoading(false);
  //   }
  // };

  // const fetchFollowingPosts = async (followingUsers) => {
  //   try {
  //     const followingPostsPromises = followingUsers.map(async (followingUserId) => {
  //       // Fetch the following user's data
  //       const followingUserDocRef = doc(collection(FIREBASE_DB, 'users'), followingUserId);
  //       const followingUserDocSnapshot = await getDoc(followingUserDocRef);
  //       const followingUserData = followingUserDocSnapshot.exists()
  //         ? { id: followingUserDocSnapshot.id, ...followingUserDocSnapshot.data() }
  //         : null;
  
  //       // Fetch the posts of the following user
  //       const postsQuery = query(collection(FIREBASE_DB, 'posts'), where('userId', '==', followingUserId));
  //       const querySnapshot = await getDocs(postsQuery);
  
  //       const followingUserPosts = [];
  //       querySnapshot.forEach((doc) => {
  //         followingUserPosts.push({ id: doc.id, ...doc.data() });
  //       });
  
  //       return { followingUserData, followingUserPosts };
  //     });
  
  //     const followingPostsData = await Promise.all(followingPostsPromises);
  //     console.log('Following Posts Data:', followingPostsData);
  
  //     // You can further process and set the state with the fetched data
  //     // For example, if you want to separate followingUserData and followingUserPosts
  //     const mergedPosts = followingPostsData.flatMap(({ followingUserPosts }) => followingUserPosts);
  //     setFollowingUserPosts(mergedPosts);
  //     console.log('merged posts:', mergedPosts)
  
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching following user posts:', error);
  //     setLoading(false);
  //   }
  // };
  
  // // Usage in useEffect
  // useEffect(() => {
  //   if (currentUser.following) {
  //     fetchFollowingPosts(currentUser.following);
  //   }
  // }, [currentUser.following]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser.following || currentUser.following.length === 0) {
          console.log('No following users.');
          return;
        }
  
        // Fetch user data for following users
        const usersPromises = currentUser.following.map(async (userId) => {
          const userDocRef = doc(collection(FIREBASE_DB, 'users'), userId);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            return { id: userDocSnapshot.id, ...userDocSnapshot.data() };
          } else {
            return null;
          }
        });
  
        const usersData = await Promise.all(usersPromises);
        const filteredUsersData = usersData.filter((user) => user !== null);
  
        // Fetch posts for following users
        const postsPromises = filteredUsersData.map(async (user) => {
          const postsQuery = query(collection(FIREBASE_DB, 'posts'), where('userId', '==', user.id));
          const postsSnapshot = await getDocs(postsQuery);
          
          const userPosts = [];
          postsSnapshot.forEach((postDoc) => {
            userPosts.push({ id: postDoc.id, ...postDoc.data() });
          });
  
          return { ...user, posts: userPosts };
        });
  
        const postsData = await Promise.all(postsPromises);
  
        // Merge user data with posts data
        const mergedData = postsData.map(({ posts, ...user }) => ({
          ...user,
          posts: posts.map((post) => ({ ...post, name: user.name, email: user.email })),
        }));
  
        // Now mergedData contains user data along with posts for each user
        // console.log('Merged data:', mergedData[0]);
        setMergedData(mergedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentUser.following]);
  

  const renderPostContent = () => {
    return (
      <View style={{paddingBottom:0}}>
        <ScrollView>
        <View>
          {mergedData.map((userData) => (
            <View key={userData.id}>
              {userData.posts.sort((a, b) => b.timestamp - a.timestamp).map((post) => (
                <View key={post.id} style={styles.postItem}>
                <View style={{width:'15%', marginRight: '5%'}}>
                    <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
                </View>
                <View style={{width:'80%', marginTop: 8}}>
                    <View >
                        <Text style={{fontSize: 15, fontWeight: 600}}>{userData.name}</Text>
                        <Text style={{fontSize: 13, fontWeight: 200}}>{userData.email}</Text>
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
            </View>
          ))}
        </View> 
          {/* {userData.sort((a, b) => b.timestamp - a.timestamp).map((post, index) => (
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
          ))} */}
        </ScrollView>
      </View>
    );
  };

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

      <View style={{paddingBottom:0}}>
      <ScrollView>
      {renderPostContent()}
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