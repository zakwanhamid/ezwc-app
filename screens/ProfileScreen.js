import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../firebase';
import { useNavigation } from '@react-navigation/native';

//this is profile screen that is unique for every user
const ProfileScreen = () => {

  const [userEmail ,setUserEmail] = useState(null);
  const navigation = useNavigation();

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          setUserEmail(currentUser.email);
        }
      }, []);

  return (
    <View style={styles.container}>
      <Text className="text-xl">Hi, {userEmail} </Text>
      <Text>this is your profile page</Text>
      <TouchableOpacity 
        className="rounded-lg bg-black px-4 py-1 mt-2 w-60"
        onPress={() => FIREBASE_AUTH.signOut()} title="Logout">
        <Text className="color-white text-lg font-bold text-center">Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'
    },
  })

export default ProfileScreen