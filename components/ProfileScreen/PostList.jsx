import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestPostList from '../HomeScreen/LatestPostList';

export default function PostList({ currentUser }) {
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        if (currentUser?.id) {
            getItemListByCurrentUser();
        }
    }, [currentUser]);

    const getItemListByCurrentUser = async () => {
        try {
            const q = query(
                collection(FIREBASE_DB, 'posts'),
                where('userId', '==', currentUser.id),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(q);
            const posts = [];
            snapshot.forEach(doc => {
                const postData = {
                    id: doc.id, // Include the document ID in the data
                    ...doc.data(),
                };
                posts.push(postData);
            });
            setPostList(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <View>
            {postList.length ? (
                <LatestPostList latestPostList={postList} heading={''} />
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        margin: 30,
        fontSize: 18,
        color: 'gray',
    },
});
