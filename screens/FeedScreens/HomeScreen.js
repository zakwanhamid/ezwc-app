import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState([]);
  const [postList, setPostList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreatePost = (currentUser) => {
    navigation.navigate('CreatePostScreen', { currentUser });
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
  }, []);

  const getPostListByFollowing = async (followingIds) => {
    const postsCollection = query(
      collection(FIREBASE_DB, 'posts'),
      where('userId', 'in', followingIds),
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc')
    );
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = await Promise.all(
      postsSnapshot.docs.map(async (postDoc) => {
        const postData = {
          id: postDoc.id,
          ...postDoc.data(),
        };
        const userDocRef = doc(FIREBASE_DB, 'users', postData.userId);
        const userDocSnapshot = await getDoc(userDocRef);

        let userData = {};
        if (userDocSnapshot.exists()) {
          userData = {
            userId: userDocSnapshot.id,
            ...userDocSnapshot.data(),
          };
        } else {
          userData = {
            userId: postData.userId,
            name: 'Unknown',
            email: 'Unknown',
            userHP: 'Unknown',
          };
        }

        return {
          id: postData.id,
          userId: userData.userId,
          userProfileImage: userData.profileImage,
          userName: userData.name,
          userEmail: userData.email,
          timestamp: postData.timestamp,
          text: postData.text,
          images: postData.images,
          comments: postData.comments,
          likes: postData.likes,
        };
      })
    );

    setPostList(postsList);
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
        return userData;
      } else {
        console.log("User document does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getCurrentUserDocument();
    setRefreshing(false);
  };

  const renderPostContent = () => {
    return (
      <LatestPostList
        latestPostList={postList}
        updatePostList={updatePostList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
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
      <View style={styles.contentContainer}>{renderPostContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
    backgroundColor: 'white',
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
  },
});

export default HomeScreen;
