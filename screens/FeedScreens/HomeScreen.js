import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import LatestPostList from "../../components/HomeScreen/LatestPostList";

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);
  const [isCommentInputModalVisible, setIsCommentInputModalVisible] = useState(false);
  const [isCommentAddedModalVisible, setIsCommentAddedModalVisible] = useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [likesModalData, setLikesModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentAdd, setCommentAdd] = useState(false);
  const [postList,setPostList] = useState([]);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const handleCreatePost = (currentUser) => {
    navigation.navigate('CreatePostScreen',{currentUser});
  };
  const handleProfileSearch = () => {
    navigation.navigate("ProfileSearchScreen");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    getCurrentUserDocument();
  },[]);

  const getPostListByFollowing = async (followingIds) => {
      setPostList([]);
      try {
          const q = query(
            collection(FIREBASE_DB, 'posts'), 
            where('userId', 'in', followingIds),
            orderBy('timestamp','desc')
            );
          const snapshot = await getDocs(q);
          
          snapshot.forEach(doc => {
              const postData = {
                  id: doc.id, // Include the docume ID in the data
                  ...doc.data(),
              };
              console.log('doc:', postData);
              setPostList(postList => [...postList, postData]);
          });
      } catch (error) {
          console.error('Error fetching item list by IDs:', error);
      }
  };

  const updatePostList = (updatedPost) => {
    setPostList(postList.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const getCurrentUserDocument = async () => {
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
  
    try {
      const userDocSnapshot = await getDoc(userRef);
      if (userDocSnapshot.exists()) {
        const userData = {
          id: userDocSnapshot.id,
          ...userDocSnapshot.data(),
        };
        console.log("User document:", userData);
        setCurrentUser(userData);
        getPostListByFollowing(userData.following);
        return userData; // Return the user document data
      } else {
        console.log("User document does not exist");
        return null; // Handle case where user document doesn't exist 
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null; // Handle error fetching user document
    }
  };

  const renderPostContent = () => {
    return (
        <View style={{paddingBottom:110}}>
          <ScrollView>
            <LatestPostList latestPostList = {postList} updatePostList={updatePostList}/>
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
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Feed</Text>
        </View>
        <TouchableOpacity onPress={() => handleCreatePost(currentUser)}>
          <AntDesign name="pluscircleo" size={24} color="#529C4E" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingBottom: 0 }}>{renderPostContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  body: {
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
    height: 60,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 2,
  },
  button: {
    width: "50%",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#529C4E",
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonTextLiked: {
    color: "#529C4E",
  },
  interactionCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 20,
    marginVertical: 10,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalSumm: {
    fontSize: 16,
    marginTop: 20,
  },
  closeBtn: {
    backgroundColor: "#529C4E",
    width: 100,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  profiles: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  profilesAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 2,
  },
  addCommHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  commentItem: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 25,
    paddingBottom: 40,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 24,
    marginRight: 16,
  },
});

export default HomeScreen;
