import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import LatestPostList from "../../components/HomeScreen/LatestPostList";

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState([]);
  const [postList,setPostList] = useState([]);

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
            where('status', '==', 'active'),
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
      <LatestPostList latestPostList={postList} updatePostList={updatePostList} />
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
      <View>{renderPostContent()}</View>
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
});

export default HomeScreen;
