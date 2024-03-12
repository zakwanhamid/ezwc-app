import { View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, collection, onSnapshot, where, getDoc } from 'firebase/firestore';

//this is profile screen that is unique for every user
const ProfileScreen = () => {

  const [user ,setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [active,setActive] = useState(0);
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
    };

    const fetchUserInfo = async () => {
        const { uid } = FIREBASE_AUTH.currentUser;
        // Discard fetch when user ID not defined
        if (!uid) return;
        const userRef = doc(collection(FIREBASE_DB,"users"), uid);
        const docSnapshot = await getDoc(userRef);
        const userData = docSnapshot.data();
        setUser(userData);
    };

    useEffect(() => {
        fetchUserInfo();
      }, []);

    console.log(FIREBASE_AUTH.currentUser.email);

    // useEffect(() => {
    //     const currentUser = FIREBASE_AUTH.currentUser.uid;
    //     const subscriber = onSnapshot(collection(FIREBASE_DB,'users'), where('userId', '==', currentUser),
    //     querySnapshot => {
    //         const user = [];
      
    //         querySnapshot.forEach(documentSnapshot => {
    //           user.push({
    //             ...documentSnapshot.data(),
    //             key: documentSnapshot.id,
    //           });
    //         });
      
    //         setCurrentUser(currentUser);
    //         setLoading(false);
    //     });
      
    //     // Unsubscribe from events when no longer in use
    //     return () => subscriber();
    // }, []);

    // console.log(currentUser.email);




    // useEffect(() => {
    //     const currentUser = FIREBASE_AUTH.currentUser;
    //     if (currentUser) {
    //         setUserEmail(currentUser.email);
    //     }
    // }, []);

  return (
    <SafeAreaView>
        {/* <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Profile</Text> 
            </View>
        </View> */}
        {/* backgrounf image */}
        <View style={{width:"100%"}}>
            <Image source={require("../assets/bg-image.jpeg")} style={styles.bgImage}></Image>
        </View>

        {/* avatar and button */}
        <View style={styles.avatarBtn}>
            <Image source={require("../assets/profilePic.jpeg")} style={styles.avatar}></Image>
            <TouchableOpacity style={styles.editBtn}>
                <Text onPress={handleEditProfile} style={{ fontWeight:"700", fontSize:14}}>Edit</Text>
            </TouchableOpacity>
        </View>

        {/* name, email, bio, following, followers */}
        <View style={{marginTop:10,marginHorizontal: 17}}>
            <Text style={{fontSize:17, fontWeight :900}}>{FIREBASE_AUTH.currentUser.name}</Text>
            <Text style={{fontSize:15, fontWeight :200, marginTop:3}}>{FIREBASE_AUTH.currentUser.email}</Text>
            <Text style={{fontSize:15, marginTop:6}}>
                {FIREBASE_AUTH.currentUser.bio}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10}}>
                <Text style={{fontSize:15, fontWeight :700}}>199</Text>
                <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
                <Text style={{fontSize:15, fontWeight :700, marginLeft:10}}>100.1K</Text>
                <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
            </View>
        </View>

        <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setActive(0)}
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 0 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17,}}>Post</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => setActive(1)} 
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 1 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17}}>Listing</Text>
            </TouchableOpacity>
        </View>
        <View>
            <TouchableOpacity 
            className="rounded-lg bg-black px-4 py-1 mt-2 w-60"
            onPress={() => FIREBASE_AUTH.signOut()} title="Logout">
            <Text className="color-white text-lg font-bold text-center">Log Out</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>




    // <View style={styles.container}>
    //   <Text className="text-xl">Hi, {userEmail} </Text>
    //   <Text>this is your profile page</Text>
    //   <TouchableOpacity 
    //     className="rounded-lg bg-black px-4 py-1 mt-2 w-60"
    //     onPress={() => FIREBASE_AUTH.signOut()} title="Logout">
    //     <Text className="color-white text-lg font-bold text-center">Log Out</Text>
    //   </TouchableOpacity>
    // </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    avatarBtn:{
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginTop:5,
    },
    titleContainer:{
      flex:1,
      justifyContent: "center",
      alignItems:"center",
      marginLeft: 70,
    },
    editBtn:{
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
    bgImage:{
        height:100,
        width: "100%"
    },
    avatar: {
        width:90,
        height:90,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
        marginTop: -50,
    },
    tabBar: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        justifyContent: "space-between",
    }
})

export default ProfileScreen