import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModuleInstrucScreen = () => {
    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
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
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Instructions</Text> 
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM}>
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
          <Text style={{fontSize: 20, fontWeight: 400, textAlign: "center", marginBottom:10}}>
            How to use this module
          </Text>
        </View>
          <View style={{marginBottom: 360}}>
            <ScrollView>
            <Text style={styles.textBg}>
                1.  There will be 10 factors that shape the university campus community's 
                pro-environmental behaviour towards Zero-Waste Campus.
            </Text>
            <Text style={styles.textBg}>
                2.  Read and understand all 10 factors in order.
            </Text>
            <Text style={styles.textBg}>
                3.  Check out our simplified summary.
            </Text>
            <Text style={styles.textBg}>
                4.  Let's put your knowledge to the test by taking a quick quiz.
                You've got this! If you correctly answer all the questions, you will
                receive a certificate!
            </Text>
            <Text style={{fontSize: 15, 
                fontWeight: 700, 
                textAlign: "center", 
                marginHorizontal: 20,
                marginTop: 10}}>
                We have summarised the relationship betweeen factors in a proposed 
                Zero-Waste Campus Framework. Let's have a view on this.
            </Text>
            <Text style={{fontSize: 15, 
                fontWeight: 700, 
                textAlign: "center", 
                marginHorizontal: 20,
                marginTop: 10}}>
                Please give us your feedback at the end of this module
            </Text>
            <Text style={{fontSize: 15, 
                fontWeight: 700, 
                textAlign: "center", 
                marginHorizontal: 20,
                marginTop: 10}}>
                Lost? Just click at the map icon at the top right corner to get you back on track!
            </Text>
            <Text style={{fontSize: 15, 
                fontWeight: 700, 
                textAlign: "center", 
                marginHorizontal: 20,
                marginTop: 10}}>
                Extra learning materials will be available once you finish this module.
            </Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={handleModuleRM}>
                    <Text style={{fontSize: 16, fontWeight:600}} > I'm ready ! </Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
          
        
    </SafeAreaView>
  )
}

export default ModuleInstrucScreen

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
    textBgBtm:{
        fontSize: 15, 
        fontWeight: 500, 
        textAlign: "center", 
        marginHorizontal: 20,
        marginTop: 10
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