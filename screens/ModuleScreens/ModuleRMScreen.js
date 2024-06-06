import {StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModuleRMScreen = () => {
    const navigation = useNavigation();
    const [currentUser ,setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };
    const handleModuleMP = () => {
        navigation.navigate('ModuleScreen');
    };
    const handleModuleBg = () => {
        navigation.navigate('ModuleBgScreen');
    };
    const handleModuleObj = () => {
        navigation.navigate('ModuleObjScreen');
    };
    const handleModuleInstruc = () => {
        navigation.navigate('ModuleInstrucScreen');
    };
    const handleModuleFactorList = () => {
        navigation.navigate('ModuleFacListScreen');
    };
    const handleModuleFacSumm = () => {
        navigation.navigate('ModuleFacSummScreen');
    };
    const handleModuleQuiz = () => {
        navigation.navigate('ModuleQuizScreen');
    };
    const handleModuleFeeback = () => {
        navigation.navigate('ModuleFeedbackScreen');
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
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>RoadMap</Text> 
            </View>
        </View>

        <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={handleModuleMP}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Main Page
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleBg}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Module Background
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleObj}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Module Objectives
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleInstruc}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Instructions
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleFactorList}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        10 Factors
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleFacSumm} disabled={currentUser.module < 10}>
                <View style={[styles.CPContainer, currentUser.module < 10 && styles.disabledCP]}>
                    <Text style={{...styles.CPDisabledTitle, fontWeight:500}}>
                        Summary
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleQuiz} disabled={currentUser.module < 10}>
                <View style={[styles.CPContainer, currentUser.module < 10 && styles.disabledCP]}>
                    <Text style={{...styles.CPDisabledTitle, fontWeight:500}}>
                        Quiz
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleFeeback} disabled={currentUser.module < 10}>
                <View style={[styles.CPContainer, currentUser.module < 10 && styles.disabledCP]}>
                    <Text style={{...styles.CPDisabledTitle, fontWeight:500}}>
                        Feedback
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    
  )
}

export default ModuleRMScreen

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
        marginLeft: -20,
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
    CPContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: "#529C4E",
        height: 50,
        width: 300,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset:{
            width: 0,
            height: 2,
        }
    },
    disabledCP:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: "white",
        height: 50,
        width: 300,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d9d8db',
    },
    CPTitle:{
        fontSize:20,
        fontWeight: 500,
    },
    CPDisabledTitle:{
        color:'grey',
        fontSize:20,
        fontWeight: 500,
    },
})