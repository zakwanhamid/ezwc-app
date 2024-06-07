import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userHP, setUserHP] = useState('');
    const [charCount, setCharCount] = useState(100);
    const [currentUser, setCurrentUser] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [wallpaperImage, setWallpaperImage] = useState(null);

    const goBack = () => {
        navigation.goBack()
    };

    useEffect(() => {
        getCurrentUserDocument();
        console.log('Current user:', currentUser)
    }, []);

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
            if (userData) {
                setName(userData.name || ''); // Set name from auth profile
                setBio(userData.bio || ''); // Set bio from auth profile
                setUserHP(userData.userHP || ''); // Set bio from auth profile
                setProfileImage(userData.profileImage || null); // Set profile image from auth profile
                setWallpaperImage(userData.wallpaperImage || null); // Set profile image from auth profile
            }

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleTextChange = (text) => {
        setText(text);
        setCharCount(100 - text.length); // Update character count
    };

    const uploadImage = async (uri, path) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(FIREBASE_STORAGE, path);
        await uploadBytes(storageRef, blob);
        return getDownloadURL(storageRef);
    };

    const handleSaveProfile = async () => {
        const { currentUser } = FIREBASE_AUTH;
        if (!currentUser) return;

        try {
            // Update user data in Firestore
            const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
            const updatedData = {
                name: name,
                bio: bio,
                userHP: userHP,
            };

            if (profileImage) {
                const profileImageUrl = await uploadImage(profileImage, `profileImages/${currentUser.uid}.jpg`);
                updatedData.profileImage = profileImageUrl;
            }

            if (wallpaperImage) {
                const wallpaperImageUrl = await uploadImage(wallpaperImage, `wallpaperImages/${currentUser.uid}.jpg`);
                updatedData.wallpaperImage = wallpaperImageUrl;
            }

            await updateDoc(userRef, updatedData);

            Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
            navigation.navigate('ProfileScreen');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const pickProfileImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        }
    };

    const pickWallpaperImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 3],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
        setWallpaperImage(result.assets[0].uri);
        }
    };


  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Edit Profile</Text> 
            </View>
            <TouchableOpacity style={styles.postBtn} onPress={handleSaveProfile}>
                <Text style={{ fontWeight:"700", fontSize:14}}>Save</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            {/* Touchable opacity for image */}
            <TouchableOpacity style={styles.imageContainer} onPress={pickProfileImage}>
                {profileImage?
                <Image source={{uri:profileImage}} style={styles.profileImage} />
                :<Image source={require('../../assets/imgPlaceholder.jpeg')}
                style={styles.profileImage}
                />}
                <Text style={styles.replaceText}>Replace</Text>
            </TouchableOpacity>
            {/* Input for name */}
            <Text style={styles.inputHeader}>Name: </Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                maxLength={30}
                value={name}
                onChangeText={setName}
                autoCorrect= {false}
                autoCapitalize='none'
            />

            <Text style={styles.inputHeader}>Phone Number: </Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                maxLength={11}
                value={String(userHP)}
                onChangeText={setUserHP}
                keyboardType='numeric'
                autoCorrect= {false}
                autoCapitalize='none'
            />

            <Text style={styles.inputHeader}>Bio: </Text>
            {/* Input for bio */}
            <TextInput
                // style={[styles.input, { height: 100 }]}
                autoFocus={true}
                multiline={true}
                numberOfLines={20}
                style={[styles.input,{height: 100}]}
                placeholder='Bio'
                value={bio}
                autoCapitalize='none'
                autoCorrect= {false}
                onChangeText={(text) => {
                    handleTextChange(text);
                    setBio(text);
                }}
                maxLength={100}
            />
            <Text style={{fontSize: 14, marginBottom:10, color: charCount <= 0 ? 'red' : 'grey' }}>
                {charCount <= 0 ? '0' : charCount} characters left
            </Text>

            <Text style={styles.inputHeader}>Wallpaper: </Text>
            {/* Touchable opacity for image */}
            <TouchableOpacity style={styles.imageContainer} onPress={pickWallpaperImage}>
                {wallpaperImage?
                <Image source={{uri:wallpaperImage}} style={styles.wallpaperImage} />
                :<Image source={require('../../assets/imgPlaceholder.jpeg')}
                style={styles.wallpaperImage}
                />}
                <Text style={styles.replaceText}>Replace</Text>
            </TouchableOpacity>
        </View>
        


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    header:{
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth:1,
      borderBottomColor: "#D8D9DB"
    },
    titleContainer:{
      flex:1,
      justifyContent: "center",
      alignItems:"center",
      marginLeft: 45,
    },
    postBtn:{
      backgroundColor: "#529C4E",
      width: 70,
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
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Make the image round
    },
    wallpaperImage: {
        width: 350,
        height: 120,
        borderRadius: 10, // Make the image round
    },
    replaceText: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 20,
        color: 'white',
        fontSize: 12,
    },
    inputHeader:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
})


export default EditProfileScreen