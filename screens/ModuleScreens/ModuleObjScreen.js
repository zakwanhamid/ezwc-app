import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const ModuleObjScreen = () => {
  const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };
    
    const handleModuleInstruc = () => {
        navigation.navigate('ModuleInstrucScreen');
    };

    const handleModuleRM = () => {
        navigation.navigate('ModuleRMScreen');
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
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Objectives</Text> 
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM} >
                <FontAwesome name="map-o" size={20} color="black" />
            </TouchableOpacity>
        </View>
        <View>
            <Image source={require('../../assets/topModuleImage.png')}
            style={{height: 150, width: '100%'}}
            />
        </View>
        <View style={{justifyContent: "center", alignItems:"center"}}>
          <Text style={{fontSize: 22, fontWeight: 600, textAlign: "center", marginTop:20}}>
            Zero Waste Campus Digital Module
          </Text>
          <Text style={{fontSize: 20, fontWeight: 400, textAlign: "center", marginBottom:20}}>
            Module Objectives
          </Text>
          <Text style={styles.textBg}>
          1.     To highlight the ten relevant factors shaping the university campus community's 
          sustainable pro-environmental behaviour towards Zero-Waste Campus.
          </Text>
          <Text style={styles.textBg}>
          2.     To enhance university campus community awareness and participation in sustainable 
          waste management towards Zero-Waste Campus.
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleModuleInstruc}>
            <Text style={{fontSize: 16, fontWeight:600}} > How can I take part ? </Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
    
  )
}

export default ModuleObjScreen

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
    textBg:{
        fontSize: 15, 
        fontWeight: 400, 
        textAlign: "left", 
        marginHorizontal: 20,
        marginTop: 10
      },
    btnContainer:{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 35,
      },
    btn: {
        backgroundColor: "#529C4E",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 40,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset:{
            width: 0,
            height: 2,
        }
    }
})