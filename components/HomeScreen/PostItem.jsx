import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';

export default function PostItem({item, updatePostList }) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState([]);
  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);
  const [isCommentInputModalVisible, setIsCommentInputModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likesModalData, setLikesModalData] = useState([]);
  const [commentsModalData, setCommentsModalData] = useState([]);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
      const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
    
      const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          const userData = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          }; // Include user ID in userData
          setCurrentUser(userData); // Log the updated currentUse
          console.log('user:',currentUser)
        } else {
          // Handle case where user document doesn't exist
          console.log("User document does not exist");
        }
      });
    
      // Make sure to return the unsubscribe function
      return () => unsubscribe;
    }, []);

    

    const handlePostLike = async (userId) => {
      try {
        const postRef = doc(collection(FIREBASE_DB, "posts"), item.id);
    
        // Get the current post data
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
    
          // Check if the likes array already contains the current user's I
          if (postData.likes.includes(userId)) {
            // Remove the user ID from the likes array
            const updatedLikes = postData.likes.filter((id) => id !== userId);

            // Update the post document with the updated likes array
            await updateDoc(postRef, { likes: updatedLikes });
            item.likes = updatedLikes;
            updatePostList(item);

            console.log("User removed from likes successfully.");

            return;
          }
    
          // Add the current user's ID to the likes array
          const updatedLikes = [...postData.likes, userId];
    
          // Update the post document with the updated likes array
          await updateDoc(postRef, { likes: updatedLikes });
          item.likes = updatedLikes;
          updatePostList(item);
    
          console.log("User added to likes successfully.");
        } else {
          console.log("Post document not found.");
        }
      } catch (error) {
        console.error("Error adding user to likes:", error);
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
        console.error("Error fetching user dataa:", error);
      }
    };

    const renderLikesModalContent = ({item}) => {
      return (
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
      );
    };

    const renderCommentsModalContent = ({item}) => {
      return (
        <View style={styles.commentContainer}>
          <View style={{ width: "20%", marginRight: "5%" }}>
            <Image
              source={require("../../assets/profilePic.jpeg")}
              style={styles.postAvatar}
            ></Image>
          </View>
          <View style={{ width: "80%", marginTop: 8 }}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                {item.commenterName}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: 200 }}>
                {item.commenterEmail}
              </Text>
              <Text>
                {item.timestamp.toDate().toLocaleString('en-US', options)}
              </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text>{item.text}</Text>
            </View>
          </View>
        </View>

      );
    };

    const handleCommentModal = (itemData) => {
      // Set the item data in state
      setIsCommentInputModalVisible(true);
    };

    const handleCommentSubmit = async (postId) => {
      if (!commentText.trim()) {
        // Handle empty comment input
        return;
      }
  
      const postRef = doc(collection(FIREBASE_DB, "posts"), postId);
      const commentsCollectionRef = collection(FIREBASE_DB, "comments");
  
      try {
        const commentData = {
          text: commentText,
          commenterId: currentUser.id,
          commenterName: currentUser.name,
          commenterEmail: currentUser.email,
          timestamp: serverTimestamp(),
          postId: postId,
        };
  
        // Add comment data to the 'comments' collection
        const newCommentRef = await addDoc(commentsCollectionRef, commentData);
  
        // Update the post document's 'comments' array with the new comment ID
        await updateDoc(postRef, {
          comments: arrayUnion(newCommentRef.id),
        });
        // Add the new comment ID to the comments array
        item.comments.push(newCommentRef.id);

        // Update local state
        updatePostList(item);
  
        setCommentText("");
        console.log("Comment added:", commentText);
        console.log("to post id:", postId);
        setIsCommentInputModalVisible(false);
        Alert.alert('Comment submitted!','Your comment has been submitted under this post');
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    const handleCommentsModalOpen = async (commentIds) => {
      try {

        const commentsPromises = commentIds.map(async (commentId) => {
          const commentDocRef = doc(FIREBASE_DB, "comments", commentId);
          const commentDocSnapshot = await getDoc(commentDocRef);
  
          if (commentDocSnapshot.exists()) {
            return { id: commentDocSnapshot.id, ...commentDocSnapshot.data() };
          } else {
            return null;
          }
        });
  
        const commentsData = await Promise.all(commentsPromises);
        const filteredCommentsData = commentsData.filter((comment) => comment !== null);
        setCommentsModalData(filteredCommentsData);
        setIsCommentsModalVisible(true);
      } catch (error) {
        console.error("Error fetching comments dataa:", error);
      }
    };

    const handleImageModalOpen = (imageUri) => {
      setSelectedImage(imageUri);
      setIsImageModalVisible(true);
    }

    const deletePost = async (itemId) => {
      try {
          console.log('postId:', itemId)
        // Show an alert to confirm deletion
        Alert.alert(
          'Confirmation',
          'Are you sure you want to delete this post?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => console.log('Deletion canceled'),
            },
            {
              text: 'Yes',
              onPress: async () => {
                try {
                  // Construct a reference to the document you want to delete
                  const itemRef = doc(FIREBASE_DB, 'posts', itemId);
    
                  // Check if the document exists before attempting to delete it
                  const itemSnapshot = await getDoc(itemRef);
                  if (itemSnapshot.exists()) {
                      // Delete the document from Firestore
                      await deleteDoc(itemRef);
                      console.log('Document deleted successfully');
                      Alert.alert(
                          'Post Deleted',
                          'The post is removed. ');
                      handleProfileScreen();
                      
                  } else {
                    console.log('Document does not exist');
                  }
                } catch (error) {
                  console.error('Error deleting document:', error);
                }
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error showing alert:', error);
      }
  };

  const handleProfileScreen = () => {
    navigation.navigate("ProfileScreen");
  };
    
  return (
      <View style={styles.postItem}>
          <View style={{width:'15%', marginRight: '5%'}}>
              <Image source={require("../../assets/profilePic.jpeg")} style={styles.postAvatar}></Image>
          </View>
          <View style={{width:'80%', marginTop: 8}}>
              <View >
                  <Text style={{fontSize: 15, fontWeight: 600}}>{item.userName}</Text>
                  <Text style={{fontSize: 13, fontWeight: 200}}>{item.userEmail}</Text>
                  <Text style={{fontSize: 13, fontWeight: 200}}>{item.timestamp.toDate().toLocaleString('en-US', options)}</Text>
                  
              </View>
              <View style={{marginTop:5}}>
                  <Text >{item.text}</Text>
              </View>
              <View style={styles.postImagesContainer}>
                  {item.images.map((imageUri, index) => (
                      <TouchableOpacity key={index} onPress={() => handleImageModalOpen(imageUri)}>
                        <Image source={{ uri: imageUri }} style={styles.postImages} />
                      </TouchableOpacity>
                  ))}
              </View>

              {
                item.userId === currentUser.id? (
                  <TouchableOpacity 
                  onPress={() => deletePost(item.id)}
                  style={{ 
                    position: 'absolute', 
                    right: 10, }}>
                    <MaterialIcons name="delete-sweep" size={23} color="gray" 
                    />
                  </TouchableOpacity>
                ):(
                null
                )
              }
              

              <View style={styles.interactionCount}>
                <TouchableOpacity
                  onPress={() => handleLikesModalOpen(item.likes)}
                >
                  {item.likes && item.likes.includes(currentUser.id) ? (
                    <AntDesign name="like1" size={20} color="#529C4E" />
                  ) : (
                    <AntDesign name="like2" size={20} color="black" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleLikesModalOpen(item.likes)}
                >
                  <Text> {item.likes? item.likes.length : 0} </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCommentsModalOpen(item.comments)}
                >
                  <FontAwesome
                    name="comments-o"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCommentsModalOpen(item.comments)}
                >
                  <Text>
                    {" "}
                    {item.comments ? item.comments.length : 0}{" "}
                  </Text>
                </TouchableOpacity>
              </View>
              { item.userId === currentUser.id ?
                (null):(<View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                >
                <TouchableOpacity
                  style={[
                    styles.button,
                    item.likes && item.likes.includes(item.userId)
                      ? styles.likedButton
                      : null,
                  ]}
                  onPress={() => handlePostLike(currentUser.id)}
                >
                  {item.likes && item.likes.includes(currentUser.id) ? (
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
                  onPress={() => handleCommentModal()}
                >
                  <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
              </View> ) 
              }
              
          </View>

          <Modal
          visible={isLikesModalVisible}
          onRequestClose={() => setIsLikesModalVisible(false)}
          animationType="fade"
          transparent={true}
          >
            <View style={styles.modalBg}>
              <View style={styles.modalContainer}>
                <Text style={[styles.modalHeader, { fontWeight: 700 }]}>Likes</Text>
                <FlatList
                  style={{ width: "90%", height: 200 }}
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
                <TouchableOpacity
                  style={[styles.closeBtn, { marginTop: 20 }]}
                  onPress={() => handleCommentSubmit(item.id)}
                >
                  <Text> Send </Text>
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
            <Text style={[styles.modalHeader, { fontWeight: 700 }]}>Comments</Text>
            <FlatList
                  style={{ width: "90%", height: 250 }}
                  data={commentsModalData}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCommentsModalContent}
                />
            <TouchableOpacity
              style={[styles.closeBtn, { marginTop: 20 }]}
              onPress={() => setIsCommentsModalVisible(false)}
            >
              <Text> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isImageModalVisible}
        onRequestClose={() => setIsImageModalVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBg}>
          <Image source={{ uri: selectedImage }} style={{height: 260 , width: '90%', margin: 10, borderRadius: 10}} />
          <TouchableOpacity
            style={[styles.closeBtn, { marginTop: 20 }]}
            onPress={() => setIsImageModalVisible(false)}
          >
            <Text> Close </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/*
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalHeader, { fontWeight: 700 }]}>
              Comments
            </Text>
            {commentsData ? (
              
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
        </View>*/}
      </View>
              
  )
}

const styles = StyleSheet.create({
  postItem: {
    flexDirection: "row",
    padding: 7,
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
  postImagesContainer:{
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  postImages:{
    width:150,
    height:100,
    borderRadius: 8,
    marginBottom:10
  },
  interactionCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 10,
    marginVertical: 10,
  },
  button: {
    width: "50%",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#529C4E",
    // backgroundColor: 'white'
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonTextLiked: {
    color: "#529C4E",
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
  commentContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },

})