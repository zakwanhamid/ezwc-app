import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const ModuleF2Screen = () => {
    const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleModuleRM = () => {
    navigation.navigate('ModuleRMScreen');
  };

  const handleModuleF3 = () => {
    navigation.navigate('ModuleF2Screen');
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
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Factor 1</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={handleModuleRM}>
                <FontAwesome name="map-o" size={20} color="black"/>
            </TouchableOpacity>
        </View>

        <View style={{alignItems:'center', justifyContent: 'center', marginTop: 20}}>
            <TouchableOpacity style={styles.NextBtn} onPress={handleModuleF3}>
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

export default ModuleF2Screen

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