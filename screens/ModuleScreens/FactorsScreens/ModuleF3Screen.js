import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const ModuleF3Screen = () => {
  const navigation = useNavigation();
  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleFacList = () => {
    navigation.navigate('ModuleFacListScreen');
  };

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

  const handleModuleF4 = async () => {
    console.log(currentUser.module)

    if (currentUser.module === 2) {
      try {
        const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
        await updateDoc(userRef, {
            module: currentUser.module + 1 // Increment module by 1
        });
        navigation.navigate('ModuleF4Screen');
      } catch (error) {
          console.error('Error updating module counter:', error);
      }
      console.log(currentUser.module)
    }else {
      console.log('Module counter is already 3');
      navigation.navigate('ModuleF4Screen');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Factor 3</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleFacList}>
                <Entypo name="list" size={20} color="black"/>
            </TouchableOpacity>
        </View>

        <View style={{alignItems:'center', justifyContent: 'center', marginTop: 20}}>
            <TouchableOpacity style={styles.NextBtn} onPress={handleModuleF4}>
                <Text style={{
                    fontSize: 15,
                    fontWeight: 600,
                }}>
                    Next Factor
                </Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default ModuleF3Screen

const styles = StyleSheet.create({
    container:{
        flex:1
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
    mapBtn:{
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
    NextBtn:{
      backgroundColor: "#529C4E",
      width: 100,
      height: 40,
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
})