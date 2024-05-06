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
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);
  const [isCommentInputModalVisible, setIsCommentInputModalVisible] =
    useState(false);
  const [isCommentAddedModalVisible, setIsCommentAddedModalVisible] =
    useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [likesModalData, setLikesModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentAdd, setCommentAdd] = useState(false);
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
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);

    const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        const userData = {
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }; // Include user ID in userData
        setCurrentUser(userData);
        console.log('ccurrentuser:',currentUser)
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
          console.log("No following users.");
          return;
        }

        // Fetch user data for following users
        const usersPromises = currentUser.following.map(async (userId) => {
          const userDocRef = doc(collection(FIREBASE_DB, "users"), userId);
          const userDocSnapshot = await getDoc(userDocRef);
          console.log("userSnapshot::", userDocSnapshot);

          if (userDocSnapshot.exists()) {
            return { id: userDocSnapshot.id, ...userDocSnapshot.data() };
          } else {
            return null;
          }
        });

        const usersData = await Promise.all(usersPromises);
        const filteredUsersData = usersData.filter((user) => user !== null);

        // Fetch posts for following users and include comments
        const postsPromises = filteredUsersData.map(async (user) => {
          const postsQuery = query(
            collection(FIREBASE_DB, "posts"),
            where("userId", "==", user.id)
          );
          const postsSnapshot = await getDocs(postsQuery);

          const userPosts = [];
          for (const postDoc of postsSnapshot.docs) {
            const postData = postDoc.data();
            const postLikes = postData.likes || [];

            // Fetch comments for the current post
            const commentsQuery = query(
              collection(FIREBASE_DB, "comments"),
              where("postId", "==", postDoc.id)
            );
            const commentsSnapshot = await getDocs(commentsQuery); // Make sure this is inside an async function

            const postComments = commentsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            userPosts.push({
              id: postDoc.id,
              ...postData,
              comments: postComments,
              likes: postLikes,
            });
          }

          return { ...user, posts: userPosts };
        });

        const postsData = await Promise.all(postsPromises);

        // Merge user data with posts data
        const mergedDatas = postsData.map(({ posts, ...user }) => ({
          ...user,
          posts: posts.map((post) => ({
            ...post,
            name: user.name,
            email: user.email,
          })),
        }));

        // Now mergedData contains user data along with posts and comments for each user
        setMergedData(mergedDatas);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.following]);

  const handlePostLike = async (postId) => {
    try {
      const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      const postRef = doc(FIREBASE_DB, "posts", postId);

      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        //console.log("PostSnapshot::",postSnapshot.data())
        const postData = postSnapshot.data();
        const postLikes = postData.likes || [];

        let updatedLikes;
        if (postLikes.includes(currentUserUid)) {
          // Remove current user id from post likes array
          updatedLikes = postLikes.filter((id) => id !== currentUserUid);
        } else {
          // Add current user id to post likes array
          updatedLikes = [...postLikes, currentUserUid];
        }

        // Update likes array in Firestore
        await updateDoc(postRef, { likes: updatedLikes });
        console.log("Post likes updated:", updatedLikes);

        // Fetch the updated post data again
        const updatedPostSnapshot = await getDoc(postRef);
        if (updatedPostSnapshot.exists()) {
          const updatedPostData = updatedPostSnapshot.data();
          const updatedPost = {
            id: updatedPostSnapshot.id,
            ...updatedPostData,
          };

          // Update the mergedData state with the updated post data
          const updatedMergedData = mergedData.map((userData) => {
            if (userData.posts) {
              const updatedPosts = userData.posts.map((post) => {
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
        console.log("Post not found");
      }
    } catch (error) {
      console.error("Error handling post like:", error);
    }
  };

  const handleLikesModalOpen = async (userIds) => {
    try {
      const usersPromises = userIds.map(async (userId) => {
        const userDocRef = doc(FIREBASE_DB, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          return { id: userDocSnapshot.id, ...userDocSnapshot.data() };
        } else {
          return null;
        }
      });

      const usersData = await Promise.all(usersPromises);
      const filteredUsersData = usersData.filter((user) => user !== null);
      setLikesModalData(filteredUsersData);
      setIsLikesModalVisible(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const renderPostContent = () => {
    return (
      <View style={{ paddingBottom: 130 }}>
        <FlatList
          data={mergedData}
          keyExtractor={(userData) => userData.id}
          renderItem={({ item: userData }) => (
            <FlatList
              data={userData.posts.sort((a, b) => b.timestamp - a.timestamp)}
              keyExtractor={(post) => post.id}
              renderItem={({ item: post }) => (
                <View style={styles.postItem}>
                  <View style={{ width: "15%", marginRight: "5%" }}>
                    <Image
                      source={require("../../assets/profilePic.jpeg")}
                      style={styles.postAvatar}
                    />
                  </View>
                  <View style={{ width: "80%", marginTop: 8 }}>
                    <View>
                      <Text style={{ fontSize: 15, fontWeight: 600 }}>
                        {userData.name}
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: 200 }}>
                        {userData.email}
                      </Text>
                      <Text>
                        {post.timestamp
                          .toDate()
                          .toLocaleString("en-US", options)}
                      </Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <Text>{post.text}</Text>
                    </View>

                    <View style={styles.interactionCount}>
                      <TouchableOpacity
                        onPress={() => handleLikesModalOpen(post.likes)}
                      >
                        {post.likes && post.likes.includes(currentUser.id) ? (
                          <AntDesign name="like1" size={20} color="#529C4E" />
                        ) : (
                          <AntDesign name="like2" size={20} color="black" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleLikesModalOpen(post.likes)}
                      >
                        <Text> {post.likes ? post.likes.length : 0} </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleCommentsModalOpen(post.id)}
                      >
                        <FontAwesome
                          name="comments-o"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleCommentsModalOpen(post.id)}
                      >
                        <Text>
                          {" "}
                          {post.comments ? post.comments.length : 0}{" "}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.button,
                          post.likes && post.likes.includes(currentUser.id)
                            ? styles.likedButton
                            : null,
                        ]}
                        onPress={() => handlePostLike(post.id)}
                      >
                        {post.likes && post.likes.includes(currentUser.id) ? (
                          <Text
                            style={[styles.buttonText, styles.buttonTextLiked]}
                          >
                            Liked
                          </Text>
                        ) : (
                          <Text style={styles.buttonText}>Like </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleCommentModal(post)}
                      >
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

  const renderLikesModalContent = () => {
    return (
      <FlatList
        data={likesModalData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.profiles}>
            <Image
              source={require("../../assets/profilePic.jpeg")}
              style={styles.profilesAvatar}
            ></Image>
            <View style={{ marginVertical: 14, marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</Text>
              <Text style={{ fontSize: 13, fontWeight: 300, marginTop: 2 }}>
                {item.email}
              </Text>
            </View>
          </View>
        )}
      />
    );
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) {
      // Handle empty comment input
      return;
    }

    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const postRef = doc(collection(FIREBASE_DB, "posts"), postId);
    const commentsCollectionRef = collection(FIREBASE_DB, "comments");

    try {
      const commentData = {
        text: commentText,
        userId: currentUserUid,
        timestamp: serverTimestamp(),
        postId: postId,
      };

      // Add comment data to the 'comments' collection
      const newCommentRef = await addDoc(commentsCollectionRef, commentData);

      // Update the post document's 'comments' array with the new comment ID
      await updateDoc(postRef, {
        comments: arrayUnion(newCommentRef.id),
      });

      setCommentText("");
      console.log("Comment added:", commentText);
      console.log("to post id:", postId);
      setIsCommentInputModalVisible(false);
      setIsCommentAddedModalVisible(true);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentModal = (itemData) => {
    // Set the item data in state
    setSelectedItem(itemData);
    setIsCommentInputModalVisible(true);
  };

  const handleCommentsModalOpen = async (postId) => {
    try {
      const comments = await fetchCommentsForPost(postId);
      setCommentsData(comments); // Set comments data separately
      console.log("comments:", comments);
      console.log("commentsData:", commentsData);
      setIsCommentsModalVisible(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      //const commentsRef = collection(FIREBASE_DB, "posts", postId, "comments");
      const commentsRef = doc(collection(FIREBASE_DB, "posts"), postId)
      console.log("commentsRef", commentsRef);

      // const postsQuery = query(
      //   collection(FIREBASE_DB, "posts"),
      //   where("userId", "==", user.id)
      // );

      console.log("Sampai sini")

      const commentsSnapshot = await getDoc(commentsRef);
      console.log("CommentDOCS", commentsSnapshot);

      /*getDoc(commentsRef)
  .then((postDoc) => {
    if (postDoc.exists()) {
      console.log("Post data:", postDoc.data().comments);
    } else {
      console.log("Post not found.");
    }
  })
  .catch((error) => {
    console.error("Error fetching post:", error);
  });
  */

      /*console.log("commentsSnapshot", commentsSnapshot);
      commentsSnapshot.forEach((doc) => {
        console.log("Document ID:", doc.id);
        console.log("Document data:", doc.data());
      });*/
      

      // await getDocs(collection(FIREBASE_DB, "posts", postId, "comments"))
      //   .then((querySnapshot) => {
      //     const newData = querySnapshot.docs
      //       .map((doc) => ({...doc.data(), id:doc.id}));
      //     console.log("COmMENT:", newData);
      //   })

      /*try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, "posts", postId, "comments"));
        if (!querySnapshot.empty) {
          const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          console.log("COMMENTS:", newData);
        } else {
          console.log("No comments found for this post.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      */

      const commentsData = [];
      if (commentsSnapshot.exists()) {
        console.log("here");
        console.log(commentsSnapshot.data().comments)
        for(let commentDoc of commentsSnapshot.data().comments) {
          const comment = { id: commentDoc };
          console.log("commentInloop:", comment);

          // Fetch comment data such as text and timestamp
          const commentDataRef = doc(FIREBASE_DB, "comments", comment.id);
          const commentDataSnapshot = await getDoc(commentDataRef);

          if (commentDataSnapshot.exists()) {
            const commentData = {
              id: commentDataSnapshot.id,
              ...commentDataSnapshot.data(),
            };

            // Fetch user data for the commenter
            const userDocRef = doc(FIREBASE_DB, "users", commentData.userId);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = {
                id: userDocSnapshot.id,
                ...userDocSnapshot.data(),
              };
              commentsData.push({
                ...comment,
                ...commentData,
                commenter: userData,
              });
            }
          }
        }
      } else {
        console.log("no");
      }
      console.log("commentsDataendfetch:", commentsData);
      return commentsData;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
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

      <Modal
        visible={isLikesModalVisible}
        onRequestClose={() => setIsLikesModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalHeader, { fontWeight: 700 }]}>Likes</Text>
            {/* <Text style={[styles.modalTitle, {fontWeight: 500, marginBottom: 20,}]}>B</Text> */}
            <FlatList
              style={{ width: "90%" }}
              data={likesModalData}
              keyExtractor={(item) => item.id}
              renderItem={renderLikesModalContent}
            />
            <TouchableOpacity
              style={[styles.closeBtn, { marginTop: 20 }]}
              onPress={() => setIsLikesModalVisible(false)}
            >
              <Text> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCommentInputModalVisible}
        onRequestClose={() => setIsCommentInputModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalHeader, { fontWeight: 700 }]}>
              Add Comment
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", top: 0, right: 0, margin: 18 }}
              onPress={() => setIsCommentInputModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Image
                source={require("../../assets/profilePic.jpeg")}
                style={styles.avatar}
              ></Image>
              <TextInput
                autoFocus={true}
                multiline={true}
                // numberOfLines={20}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, textAlignVertical: "top" }}
                placeholder="Enter your comment..."
                value={commentText}
                onChangeText={(text) => setCommentText(text)}
                maxLength={100}
              ></TextInput>
            </View>
            {selectedItem && (
              <TouchableOpacity
                style={[styles.closeBtn, { marginTop: 20 }]}
                onPress={() => handleCommentSubmit(selectedItem.id)}
              >
                <Text> Send </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCommentAddedModalVisible}
        onRequestClose={() => setIsCommentAddedModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalHeader, { fontWeight: 600 }]}>
              Comment Added !
            </Text>
            <TouchableOpacity
              style={[styles.closeBtn, { marginTop: 20 }]}
              onPress={() => setIsCommentAddedModalVisible(false)}
            >
              <Text> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCommentsModalVisible}
        onRequestClose={() => setIsCommentsModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalHeader, { fontWeight: 700 }]}>
              Comments
            </Text>
            {commentsData ? (
              <FlatList
                data={commentsData}
                keyExtractor={(comment) => comment.id}
                style={{ height: 250, marginTop: 10 }}
                renderItem={({ item: comment }) => (
                  <View style={styles.commentItem}>
                    <View style={{ width: "15%", marginRight: "5%" }}>
                      <Image
                        source={require("../../assets/profilePic.jpeg")}
                        style={styles.postAvatar}
                      ></Image>
                    </View>
                    <View style={{ width: "80%", marginTop: 8 }}>
                      <View>
                        <Text style={{ fontSize: 15, fontWeight: 600 }}>
                          {comment.commenter.name}
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: 200 }}>
                          {comment.commenter.email}
                        </Text>
                        <Text>
                          {comment.timestamp
                            .toDate()
                            .toLocaleString("en-US", options)}
                        </Text>
                      </View>
                      <View style={{ marginTop: 5 }}>
                        <Text>{comment.text}</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text> No comment available</Text>
            )}
            <TouchableOpacity
              style={[styles.closeBtn, { marginTop: 20 }]}
              onPress={() => setIsCommentsModalVisible(false)}
            >
              <Text> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
