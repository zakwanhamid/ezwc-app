import { View, Text, SafeAreaView, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const [currentUser, setCurrentUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

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
            console.log(currentUser.email);
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
    }, []); 

    const handleSearch = async () => {
        if (searchQuery.length >= 3) {
            try {
                const normalizedSearchQuery = searchQuery.trim().toLowerCase();
                console.log("Normalized Search Query:", normalizedSearchQuery);
                
                // Fetch all listings
                const listingsCollection = collection(FIREBASE_DB, 'listings');
                const querySnapshot = await getDocs(listingsCollection);
                console.log("Query Snapshot Size:", querySnapshot.size);
    
                const postsList = await Promise.all(
                    querySnapshot.docs.map(async (postDoc) => {
                        const postData = {
                            id: postDoc.id,
                            ...postDoc.data(),
                        };
    
                        // Only include posts that contain the search query in their title
                        if (postData.title.toLowerCase().includes(normalizedSearchQuery)) {
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
                                ...postData,
                                userName: userData.name,
                                userEmail: userData.email,
                                userHP: userData.userHP,
                                userProfileImage: userData.profileImage,
                            };
                        } else {
                            return null;
                        }
                    })
                );
    
                // Filter out null results
                const filteredPostsList = postsList.filter(post => post !== null);
                
                console.log("Filtered Posts List:", filteredPostsList);
                navigation.navigate('ListingSearchScreen', { postsList: filteredPostsList, searchQuery });
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        } else {
            console.log('Enter at least 3 characters');
        }
    };
    

    return (
        <View>
            <View style={styles.searchBarContainer}>
                <TextInput
                    placeholder='Search'
                    clearButtonMode='always'
                    style={styles.searchBar}
                    autoCorrect={false}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    autoCapitalize='none'
                />
                <TouchableOpacity style={{padding: 8}} onPress={handleSearch}>
                    <FontAwesome name="search" size={23} color="#529C4E" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profilesAvatar:{
        width: 70,
        height: 70,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
    },
    welcometxt:{
        fontSize: 16,
    },
    nametxt:{
        fontSize: 20,
        fontWeight: '600'
    },
    searchBarContainer:{
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal:20,
        marginTop:20,
    },
    searchBar:{
        paddingHorizontal: 20,
        paddingVertical:5,
        borderColor: '#ccc',
        borderWidth:1,
        borderRadius:8,
        fontSize: 17,
        width: '91%'
    },
});
