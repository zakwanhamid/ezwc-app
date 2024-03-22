import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const ModuleRMScreen = () => {
    const navigation = useNavigation();
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
            <TouchableOpacity onPress={handleModuleFacSumm}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Summary
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleQuiz}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
                        Quiz
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModuleFeeback}>
                <View style={styles.CPContainer}>
                    <Text style={{...styles.CPTitle, fontWeight:500}}>
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
    CPTitle:{
        fontSize:20,
        fontWeight: 500

    },
})