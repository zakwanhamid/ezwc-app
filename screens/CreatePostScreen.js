import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

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
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 20, fontWeight:"600"}}>Create Post</Text> 
            </View>
            <TouchableOpacity style={styles.postBtn}>
              <Text  style={{ fontWeight:"700", fontSize:14}}>Post</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <Text>This is your homepage</Text>
            <Text>All the post will be shown here</Text>
          </View>
        </SafeAreaView>
        // <View style={styles.container}>
        //   <Text>Welcome to Home Screen</Text>
          
        // </View>
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
        marginLeft: 75,
      },
      body:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
      }
    })

export default CreatePostScreen