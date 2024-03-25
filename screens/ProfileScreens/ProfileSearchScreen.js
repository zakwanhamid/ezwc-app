import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileSearchScreen = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Search User Profile</Text> 
            </View>
        </View>
        <View style={styles.searchBarContainer}>
            <TextInput 
            placeholder='Search' 
            clearButtonMode='always' 
            autoCapitalize='none'
            style={styles.searchBar}
            />
        </View>
    </SafeAreaView>
    
  )
}

export default ProfileSearchScreen

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
        borderBottomColor: "#D8D9DB",
      },
    titleContainer:{
        flex:1,
        justifyContent: "center",
        alignItems:"center",
        marginLeft: -9,
      },
    searchBarContainer:{
        margin:10,
    },
    searchBar:{
        paddingHorizontal: 20,
        paddingVertical:10,
        borderColor: '#ccc',
        borderWidth:1,
        borderRadius:8,
    }
})