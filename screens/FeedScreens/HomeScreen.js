import { View, Text, TouchableOpacity, Button, StyleSheet, Image, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

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
        const userData = { id: documentSnapshot.id, ...documentSnapshot.data() }; // Include user ID in userData
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

  const handlePostLike = async (postId) => {
    try {
      const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      const postRef = doc(FIREBASE_DB, 'posts', postId);
  
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        const postLikes = postData.likes || [];
  
        let updatedLikes;
        if (postLikes.includes(currentUserUid)) {
          // Remove current user id from post likes array
          updatedLikes = postLikes.filter(id => id !== currentUserUid);
        } else {
          // Add current user id to post likes array
          updatedLikes = [...postLikes, currentUserUid];
        }
  
        // Update likes array in Firestore
        await updateDoc(postRef, { likes: updatedLikes });
        console.log('Post likes updated:', updatedLikes);
  
        // Fetch the updated post data again
        const updatedPostSnapshot = await getDoc(postRef);
        if (updatedPostSnapshot.exists()) {
          const updatedPostData = updatedPostSnapshot.data();
          const updatedPost = { id: updatedPostSnapshot.id, ...updatedPostData };
  
          // Update the mergedData state with the updated post data
          const updatedMergedData = mergedData.map(userData => {
            if (userData.posts) {
              const updatedPosts = userData.posts.map(post => {
                if (post.id === postId) {
                  return updatedPost;
                }
                return post;
              });
              return { ...userData, posts: updatedPosts };
            }
            return userData;
          });
          setMergedData(updatedMergedData);
        }
      } else {
        console.log('Post not found');
      }
    } catch (error) {
      console.error('Error handling post like:', error);
    }
  };
  
  
  

  const renderPostContent = () => {
    return (
      <View style={{paddingBottom:130}}>
        <FlatList
          data={mergedData}
          keyExtractor={(userData) => userData.id}
          renderItem={({ item: userData }) => (
            <FlatList
              data={userData.posts.sort((a, b) => b.timestamp - a.timestamp)}
              keyExtractor={(post) => post.id}
              renderItem={({ item: post }) => (
                <View style={styles.postItem}>
                  <View style={{ width: '15%', marginRight: '5%' }}>
                    <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar} />
                  </View>
                  <View style={{ width: '80%', marginTop: 8 }}>
                    <View>
                      <Text style={{ fontSize: 15, fontWeight: 600 }}>{userData.name}</Text>
                      <Text style={{ fontSize: 13, fontWeight: 200 }}>{userData.email}</Text>
                      <Text>{post.timestamp.toDate().toLocaleString('en-US', options)}</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <Text>{post.text}</Text>
                    </View>

                    <View style={styles.interactionCount}>
                      <TouchableOpacity>
                        { post.likes && post.likes.includes(currentUser.id) ? 
                        (<AntDesign name="like1" size={20} color="#529C4E" />) :
                        (<AntDesign name="like2" size={20} color="black" />)
                        }
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text> {post.likes ? post.likes.length : 0} </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <FontAwesome name="comments-o" size={24} color="black" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity>
                        <Text> {post.comment ? post.comment.length : 0} </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity 
                        style={[
                          styles.button, 
                          post.likes && post.likes.includes(currentUser.id) ? styles.likedButton : null]} 
                        onPress={() => handlePostLike(post.id)}
                      >
                        {post.likes && post.likes.includes(currentUser.id) ?(
                          <Text style={[styles.buttonText, styles.buttonTextLiked ]}>Liked</Text>
                          ):(
                          <Text style={styles.buttonText}>Like </Text>
                          )}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        />
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
        {renderPostContent()}
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
  buttonTextLiked: {
    color: "#529C4E",
  },
  interactionCount:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'flex-end',
    marginRight: 20,
    marginVertical: 10,
  },
})

export default HomeScreen;