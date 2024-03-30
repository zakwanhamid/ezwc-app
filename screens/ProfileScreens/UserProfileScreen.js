import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfileScreen = ({ route }) => {
  const [user ,setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser ,setCurrentUser] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [userPosts ,setUserPosts] = useState([]);
  const [active,setActive] = useState(0);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
  const navigation = useNavigation();
  const {userId} = route.params;
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
    console.log('user:' ,userId)
    console.log('current user following:',currentUser.following);
    console.log('user followers', user.followers);
  };

  useEffect(() => {
    if (user && user.following) {
      setFollowingCount(user.following.length);
    } else {
      setFollowingCount(0);
    }
  }, [user, user.following]);

  useEffect(() => {
    if (user && user.followers) {
      setFollowersCount(user.followers.length);
    } else {
      setFollowersCount(0);
    }
  }, [user, user.followers]);


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
        // Check if userId is in the currentUser's following array
        if (currentUser && currentUser.following && currentUser.following.includes(userId)) {
        setIsFollowing(true); // Set isFollowing to true if already following
        } else {
        setIsFollowing(false); // Set isFollowing to false if not following
        }
    }, [currentUser, user]);

    


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

    const handleFollow = async () => {
        if (!currentUser || !user) {
        console.error('Invalid user or otherUserId.');
        return;
        }

        try {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, 'users'), userId);
        const currentUserRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);

        // Check if otherUserId is already followed by currentUser
        if (isFollowing) {
            // Remove otherUserId from currentUser's following array
            await updateDoc(currentUserRef, {
                following: arrayRemove(userId)
            });
            // Remove currentUser's uid from otherUserId's followers array
            await updateDoc(userRef, {
                followers: arrayRemove(currentUserUid)
            });
            setIsFollowing(false);
            console.log('User unfollowed successfully.');


        } else {
            // Add otherUserId to currentUser's following array
            await updateDoc(currentUserRef, {
                following: arrayUnion(userId)
            });
            // Add currentUser's uid to otherUserId's followers array
            await updateDoc(userRef, {
                followers: arrayUnion(currentUserUid)
            });
            setIsFollowing(true);
            console.log('User followed successfully.');
        }
        } catch (error) {
        console.error('Error following/unfollowing user:', error);
        }
    };


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
            <TouchableOpacity style={[styles.followBtn, {
                backgroundColor: isFollowing ? 'white' : '#529C4E',
                borderColor: isFollowing ? '#529C4E' : 'white',
                borderWidth: 1
                }]} 
                onPress={handleFollow}
            >
                <Text style={{ fontWeight:"700", fontSize:14}}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Text>
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
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => setIsFollowingModalVisible(true)} >
                    <Text style={{fontSize:15, fontWeight :700}}>{followingCount}</Text>
                    <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
                    
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => setIsFollowersModalVisible(true)}>
                    <Text style={{fontSize:15, fontWeight :700, marginLeft:10}}>{followersCount}</Text>
                    <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Followers</Text>
                </TouchableOpacity>
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

        <Modal
            visible={isFollowersModalVisible} 
            onRequestClose={() => setIsFollowersModalVisible(false)}
            animationType='fade'
            transparent={true}
        >
            <View style={styles.modalBg}>
            <View style = {styles.modalContainer}>
                <Text style={[styles.modalHeader, {fontWeight: 700}]}>Followers</Text>
                <Text style={[styles.modalTitle, {fontWeight: 500}]}>Below are your followers</Text>
                <Text style={[styles.modalSumm, {textAlign:'center'}]}>
                Environmental education is a process that allows individuals to explore
                environmental issues, engage in problem-solving, and take steps to protect the 
                environment to gain a better understanding of the issues and make more informed decisions.
                </Text>
                <TouchableOpacity style={[styles.closeBtn, {marginTop: 20,}]} onPress={() => setIsFollowersModalVisible(false)}>
                <Text> Close </Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>

        <Modal
            visible={isFollowingModalVisible} 
            onRequestClose={() => setIsFollowingModalVisible(false)}
            animationType='fade'
            transparent={true}
        >
            <View style={styles.modalBg}>
            <View style = {styles.modalContainer}>
                <Text style={[styles.modalHeader, {fontWeight: 700}]}>Following</Text>
                <Text style={[styles.modalTitle, {fontWeight: 500}]}>Below are your following</Text>
                <Text style={[styles.modalSumm, {textAlign:'center'}]}>
                Environmental education is a process that allows individuals to explore
                environmental issues, engage in problem-solving, and take steps to protect the 
                environment to gain a better understanding of the issues and make more informed decisions.
                </Text>


                
                <TouchableOpacity style={[styles.closeBtn, {marginTop: 20,}]} onPress={() => setIsFollowingModalVisible(false)}>
                <Text> Close </Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
        
                

        
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
    followBtn:{
        width: 90,
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
    modalBg: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalContainer:{
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
        alignItems:'center'
      },
      modalHeader:{
        fontSize: 20,
      },
      modalTitle:{
        fontSize: 18,
      },
      modalSumm:{
        fontSize: 16,
        marginTop: 20,
      },
      closeBtn:{
        backgroundColor: "#529C4E",
        width: 100,
        height: 40,
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
})