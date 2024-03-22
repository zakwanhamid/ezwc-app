import { View, Text, Button, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import * as Progress from 'react-native-progress'

const ModuleScreen = () => {
  const navigation = useNavigation();
  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const progressPercentage = (currentUser.module / 10 * 100 ) + '%';
  const handleModuleBg = () => {
    navigation.navigate('ModuleBgScreen');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);

    const unsubscribe = onSnapshot(userRef, documentSnapshot => {
        if (documentSnapshot.exists()) {
            const userData = documentSnapshot.data(); // Get user data directly
            setCurrentUser(userData);
            setLoading(false);
        } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
        }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView>
      
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Text style={{
              fontSize:14, 
              textAlign:'center', 
              fontWeight: 700,
              }}>Progress: {progressPercentage}</Text>
            {/* <Progress.Bar
              animated={true}
              size={40}
              progress={progressPercentage}
              borderColor= "#529C4E"
              color="#529C4E"
              borderWidth={2}
            /> */}
          </View>
        </View>

        <View style={{alignItems: "center", marginTop: 20}}>
          <Image source={require('../../assets/modulePageImage.png')}/>
        </View>
        <View style={{justifyContent: "center", alignItems:"center"}}>
          <Text style={{fontSize: 30, fontWeight: 600, textAlign: "center", margin:20}}>
            Zero Waste Campus Digital Module
          </Text>
          <Text style={{fontSize: 20, fontWeight: 400, textAlign: "center", marginHorizontal: 20}}>
            Discover what it takes and what we can do to help build a 
            Zero Waste Campus by diving into the information and experiencing 
            the learning! 
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleModuleBg}>
            <Text style={{fontSize: 16, fontWeight:600}} > ENTER </Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center', marginTop: 20}}>
          <TouchableOpacity>
            <Text style={{color: "gray"}}>
              Click the here to continue your progress
            </Text>
          </TouchableOpacity>
        </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    btnContainer:{
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    btn: {
      backgroundColor: "#529C4E",
      alignItems: "center",
      justifyContent: "center",
      width: 150,
      height: 40,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowOffset:{
          width: 0,
          height: 2,
      }
    },
    progressBarContainer:{
      alignItems: 'center',
    },
    progressBar:{
      position: 'absolute',
    }




  })

export default ModuleScreen