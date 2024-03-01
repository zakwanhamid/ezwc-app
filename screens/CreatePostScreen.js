import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const CreatePostScreen = () => {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    const handleTextChange = (text) => {
        setText(text);
    };

    const pickImage = async () => {
        if (images.length >= 4) {
            alert("Maximum 4 images allowed. Please remove an image to upload another.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const handlePost = () => {
        // Save text and images to Firestore using Fire.shared.addPost method
        Fire.shared.addPost({ text, images })
            .then(() => {
                // Reset text and images state
                setText('');
                setImages([]);
                // Navigate back to the previous screen
                goBack();
            })
            .catch(error => {
                console.log('Error:', error);
            });
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };
      
    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 20, fontWeight:"600"}}>Create Post</Text> 
                </View>
                <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
                    <Text style={{ fontWeight:"700", fontSize:14}}>Post</Text>
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
                    value={text}
                    onChangeText={handleTextChange}
                ></TextInput>
            </View>
            <TouchableOpacity style={styles.photo} onPress={pickImage}>
                <Ionicons name="md-camera" size={32} color="#696969"> </Ionicons>
            </TouchableOpacity>

            <View style={{ marginHorizontal: 32, marginTop: 32, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {images.slice(0, 4).map((uri, index) => (
                    <View key={index} style={{ width: '48%', marginBottom: 10 }}>
                        <Image source={{ uri: uri }} style={{ width: '100%', aspectRatio: 1, borderRadius: 5 }} />
                        <TouchableOpacity onPress={() => removeImage(index)} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

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
        marginHorizontal: 25,
        marginTop: 25,
        paddingBottom: 40,
        flexDirection: "row",
        borderBottomWidth:1,
        borderBottomColor: "#D8D9DB",
      },
      avatar: {
        width:60,
        height:60,
        borderRadius: 24,
        marginRight:16,
      },
      photo: {
        alignItems: "flex-end",
        marginHorizontal: 32,
        paddingTop: 15,
      }
    })

export default CreatePostScreen