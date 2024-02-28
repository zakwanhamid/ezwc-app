import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreatePostScreen = () => {
  const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
    }, [navigation]);
      
    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity >
                    <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 20, fontWeight:"600"}}>Create Post</Text> 
                </View>
                <TouchableOpacity style={styles.postBtn}>
                    <Text  style={{ fontWeight:"700", fontSize:14}}>Post</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Image source={require("../assets/profilePic.jpeg")} style={styles.avatar}></Image>
                <TextInput
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    style={{ flex: 1}}
                    placeholder='Want to share something?'
                >
                </TextInput>
            </View>
            <TouchableOpacity style={styles.photo}>
                <Ionicons name="md-camera" size={32} color="#CBD9DB"> </Ionicons>
            </TouchableOpacity>
        </SafeAreaView>
      )
    }
    
    
    const styles = StyleSheet.create({
      container:{
        flex:1,
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
      postBtn:{
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
      inputContainer:{
        margin: 25,
        flexDirection: "row"
      },
      avatar: {
        width:60,
        height:60,
        borderRadius: 24,
        marginRight:16,
      },
      photo:{
        alignItems: "flex-end",
        marginHorizontal: 32,

      }
    })

export default CreatePostScreen