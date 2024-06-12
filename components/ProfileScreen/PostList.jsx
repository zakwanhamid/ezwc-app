import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestPostList from '../HomeScreen/LatestPostList';
import LatestPostListPro from '../HomeScreen/LatestPostListPro';

export default function PostList({ currentUser }) {
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        if (currentUser?.id) {
            getItemListByCurrentUser();
        }
    }, [currentUser]);//a

    const getItemListByCurrentUser = async () => {
        const postsCollection = query(
            collection(FIREBASE_DB, 'posts'),
            where('userId', '==', currentUser.id),
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
                likes: postData.likes
              };
          })
        );
    
        setPostList(postsList);
      };

    return (
        <View>
            {postList.length ? (
                <LatestPostListPro latestPostList={postList} heading={''} />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No post available...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        margin: 30,
        fontSize: 18,
        color: 'gray',
    },
});
