import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../firebase';

//this is the feed screen that will show all posts
const HomeScreen = () => {
  const navigation = useNavigation();
  const [userEmail ,setUserEmail] = useState(null);

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  // useLayoutEffect(()=>{
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // } , [])

  return (
    <View className=" items-center">
      
      <Text className="text-xl">Hi, {userEmail}  </Text>
      <Text>Welcome to Home Screen</Text>
      <TouchableOpacity 
        className="rounded-lg bg-black px-4 py-2 mt-2 w-60"
        onPress={() => FIREBASE_AUTH.signOut()} title="Logout">
        <Text className="color-white text-xl font-bold text-center">Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen;