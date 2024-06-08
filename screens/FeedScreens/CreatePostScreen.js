import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const CreatePostScreen = ({ route }) => {
    const { currentUser } = route.params;
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const navigation = useNavigation();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [charCount, setCharCount] = useState(280);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack();
    };

    const handleHomeScreen = () => {
        navigation.navigate("HomeScreen");
    };

    const handleTextChange = (text) => {
        setText(text);
        setCharCount(280 - text.length);
    };

    const pickImage = async () => {
        if (images.length >= 4) {
            Alert.alert("Limit Reached", "Only 4 images are allowed.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => asset.uri);
            setImages((prevImages) => [...prevImages, ...selectedImages].slice(0, 4));

            for (const asset of result.assets) {
                const sizeInMB = asset.fileSize / (1024 * 1024);
                console.log(`Image size: ${sizeInMB} MB`);
            }
        }
    };

    const onSubmitMethod = async (value) => {
        try {
            console.log('images:', images);

            // Handle uploading multiple images
            const uploadTasks = images.map(async (image) => {
                const resp = await fetch(image);
                const blob = await resp.blob();
                const storageRef = ref(FIREBASE_STORAGE, 'post-imgs/' + Date.now() + ".jpg");
                await uploadBytes(storageRef, blob);
                return getDownloadURL(storageRef);
            });

            // Wait for all uploads to finish
            const downloadURLs = await Promise.all(uploadTasks);

            // Assign the download URLs to the post data
            value.images = downloadURLs;
            console.log('download url:', downloadURLs);

            // Create the post in Firestore
            const docRef = await addDoc(collection(FIREBASE_DB, "posts"), value);
            if (docRef.id) {
                const updateRef = doc(FIREBASE_DB, 'posts', docRef.id);
                await updateDoc(updateRef, {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userEmail: currentUser.email
                });
                console.log('post successfully added:', docRef.id);
                Alert.alert('Successfully Added', "Your post is successfully added. This post will be view by other users");
                handleHomeScreen();
            }
        } catch (error) {
            console.error('Error adding post:', error);
        } finally {
            setImages([]);
        }
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={{ text: '', likes: [], images: [], userId: '', userName: '', userEmail: '', timestamp: new Date(), status: 'active' }}
                onSubmit={value => {
                    setFormSubmitted(true);
                    onSubmitMethod(value);
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.text) {
                        console.log("Title not Present");
                        Alert.alert('Alert!', 'Please fill in all the fields...', [{ text: 'OK', onPress: () => { }, style: 'cancel' }], { cancelable: false });
                        errors.name = "Title Must be there";
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                    <View>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={goBack}>
                                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <Text style={{ fontSize: 20, fontWeight: "600" }}>Create Post</Text>
                            </View>
                            <TouchableOpacity style={styles.postBtn} onPress={handleSubmit}>
                                <Text style={{ fontWeight: "700", fontSize: 14 }}>Post</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            {currentUser.profileImage?
                            <Image source={{uri:currentUser.profileImage}} style={styles.avatar} />
                            :<Image source={require('../../assets/blankAvatar.webp')}
                            style={styles.avatar}
                            />}
                            <TextInput
                                autoFocus={true}
                                multiline={true}
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={{ flex: 1, textAlignVertical: 'top' }}
                                placeholder='Want to share something?'
                                value={values?.text}
                                onChangeText={(text) => {
                                    handleChange('text')(text);
                                    handleTextChange(text);
                                }}
                                maxLength={280}
                            ></TextInput>
                        </View>
                        <View>
                            <Text style={{ marginLeft: 25, marginTop: 5, fontSize: 14, color: charCount <= 0 ? 'red' : 'grey' }}>
                                {charCount <= 0 ? '0' : charCount} characters left
                            </Text>
                        </View>
                        <Text style={{ marginLeft: 25, marginTop: 5, fontSize: 14, color: 'grey' }}>
                            Total images allowed: 4 | Total size: 60MB
                        </Text>
                        <TouchableOpacity style={styles.photo} onPress={pickImage}>
                            <Ionicons name="camera" size={32} color="#696969"> </Ionicons>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

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
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 45,
    },
    postBtn: {
        backgroundColor: "#529C4E",
        width: 70,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        elevation: 5,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    postItem: {
        flexDirection: "row",
        paddingTop: 7,
        paddingHorizontal: 7,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        height: 100,
    },
    inputContainer: {
        marginHorizontal: 25,
        marginTop: 25,
        paddingBottom: 40,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 24,
        marginRight: 16,
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32,
        paddingTop: 15,
    }
})

export default CreatePostScreen;
