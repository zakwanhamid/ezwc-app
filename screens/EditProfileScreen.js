import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [charCount, setCharCount] = useState(100);

    const goBack = () => {
        navigation.goBack()
    };

    useEffect(() => {
        const { currentUser } = FIREBASE_AUTH;
        if (currentUser) {
            setName(currentUser.name || ''); // Set name from auth profile
            setBio(currentUser.bio || ''); // Set bio from auth profile
        }
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleTextChange = (text) => {
        setText(text);
        setCharCount(100 - text.length); // Update character count
    };

    const handleSaveProfile = async () => {
        const { currentUser } = FIREBASE_AUTH;
        if (!currentUser) return;

        try {
            // Update user data in Firestore
            const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
            await updateDoc(userRef, {
                name: name,
                bio: bio,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };


  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
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
            <TouchableOpacity style={styles.imageContainer}>
                <Image
                    source={require("../assets/profilePic.jpeg")}
                    style={styles.image}
                />
                <Text style={styles.replaceText}>Replace</Text>
            </TouchableOpacity>
            {/* Input for name */}
            <TextInput
                style={styles.input}
                placeholder="Name"
                maxLength={30}
                value={name}
                onChangeText={setName}

            />
            {/* Input for bio */}
            <TextInput
                // style={[styles.input, { height: 100 }]}
                autoFocus={true}
                multiline={true}
                numberOfLines={20}
                style={[styles.input,{height: 100}]}
                placeholder='Bio'
                value={bio}
                onChangeText={(text) => {
                    handleTextChange(text);
                    setBio(text);
                }}
                maxLength={100}
            />
        </View>
        <View>
            <Text style={{ marginLeft: 25, marginTop: 5, fontSize: 14, color: charCount <= 0 ? 'red' : 'grey' }}>
                {charCount <= 0 ? '0' : charCount} characters left
            </Text>
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
        paddingTop: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50, // Make the image round
    },
    replaceText: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 20,
        color: 'white',
        fontSize: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
})


export default EditProfileScreen