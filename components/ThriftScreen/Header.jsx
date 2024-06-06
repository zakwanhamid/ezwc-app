import { View, Text, SafeAreaView, Image, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';

export default function Header({searchQuery, setSearchQuery, onSearch}) {
    const [currentUser, setCurrentUser] = useState([]);
    

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
            console.log(currentUser.email)
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
    }, []); 
  
  return (
    <View>
        {/* <View style={styles.container}>
            <Image source={require("../../assets/profilePic.jpeg")} style={styles.profilesAvatar}></Image>
            <View>
                <Text style={styles.welcometxt} >Welcome,</Text>
                <Text style={styles.nametxt} >{currentUser.name}</Text>
            </View>
        </View> */}
        
        <View style={styles.searchBarContainer}>
            <TextInput
                placeholder='Search' 
                clearButtonMode='always' 
                autoCapitalize='none'
                style={styles.searchBar}
                autoCorrect={false}
                value={searchQuery}
                onChangeText={(value) => setSearchQuery(value)}
                onSubmitEditing={onSearch}
            />
        </View>
    </View>
  )
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
        // paddingHorizontal:20,
        marginHorizontal:20,
        marginTop:20,
    },
    searchBar:{
        paddingHorizontal: 20,
        paddingVertical:10,
        borderColor: '#ccc',
        borderWidth:1,
        borderRadius:8,
        fontSize: 16,
    },
})