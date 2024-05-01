import { Alert, Button, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const AddListingScreen = () => {
    const [image, setImage] = useState(null);
    const [categoryList, setCategoryList]= useState([{ name: 'Select Category' }]); 
    const [currentUser, setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    useEffect(()=> {
        getCategoryList();
    },[])

    useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
    
        const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            const userData = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }; // Include user ID in userData
            setCurrentUser(userData);
            console.log(currentUser.email)
            setLoading(false);
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
      }, []);

    const getCategoryList =  async() =>{
        setCategoryList([{ name: 'Select Category' }])
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'category'));
        querySnapshot.forEach((doc)=>{
            console.log("Docs:", doc.data());
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setModalVisible(false);
    }

    // Used to Pick Image from gallery
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async(value)=>{
        //Convert uri to blob file
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(FIREBASE_STORAGE, 'listing-imgs/'+Date.now()+".jpg");

        uploadBytes(storageRef, blob).then((snapshot) => {
            console.log('Uploaded a blob or file!')
        }).then((resp)=>{
            getDownloadURL(storageRef).then(async(downloadUrl)=>{
                console.log(downloadUrl);
                value.image = downloadUrl;
                // value.userId = currentUser.id;
                // value.userName = currentUser.name;
                // value.userEmail = currentUser.email;
                const docRef = await addDoc(collection(FIREBASE_DB, "listings"), value);
                if(docRef.id)
                {
                    const updateRef = doc(FIREBASE_DB, 'listings', docRef.id);
                        await updateDoc(updateRef, {
                            userId: currentUser.id,
                            userName: currentUser.name,
                            userEmail: currentUser.email
                });
                    console.log("Document Added!")
                }
            })
        });
        setImage('');
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Add New Listing</Text>
            </View>
        </View>
        <View style={styles.inputContainer}>
            <View style={{marginVertical:15}}>
                <Text style={{fontSize:26, fontWeight: '700'}}>Advertise Your Used Item!</Text>
                <Text style={{fontSize:16, color: 'gray', fontWeight: '500' }}>Create New Post and Start Selling.</Text>
            </View>
            
            <Formik
             initialValues={{title:'', desc:'', category:'', location:'', price:'', image:'', userId: `${currentUser.id}`, userName:'', userEmail:'', userPH:''}}
             onSubmit={value => {
                // Handle form submission
                setFormSubmitted(true);
                onSubmitMethod(value);
                //convert
            }}
            validate={(values)=>{
                const errors={}
                if(!values.title)
                {
                  console.log("Title not Present");
                  Alert.alert('Alert!', 'Please fill in all the fields...', [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
                  errors.name="Title Must be there"
                }
                return errors
              }}
            //  validate={values=>{
            //     const errors={}
            //     if(formSubmitted &&(!values.title || !values.desc || !values.category || !values.location || !values.price || !values.image))
            //     {
            //         console.log("Title not present");
            //         Alert.alert('Alert!', 'Please fill in all the fields...', [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
            //         errors.name='Please fill in the title'
            //     }
            //     return errors;
            //  }}
             >
                {({handleChange, handleBlur, handleSubmit, values,setFieldValue, errors})=>(
                    <View>
                        <TouchableOpacity onPress={pickImage}>
                        {image?
                        <Image source={{uri:image}} style={{height: 100, width: 100, borderRadius:15 }} />
                        :<Image source={require('../../assets/imgPlaceholder.jpeg')}
                        style={{height: 100, width: 100, borderRadius:15 }}
                        />}
                            
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder='Title'
                            value={values?.title}
                            onChangeText={handleChange('title')}
                        />
                        <TextInput
                            style={[styles.input,{height: 100, paddingTop:15}]}
                            placeholder='Description'
                            value={values?.desc}
                            // numberOfLines={}
                            onChangeText={handleChange('desc')}
                            multiline
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Price (RM)'
                            value={values?.price}
                            keyboardType='numeric'
                            onChangeText={handleChange('price')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Location'
                            value={values?.location}
                            onChangeText={handleChange('location')}
                        />
                        {/* Category List Dropdown */}
                        <View>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={{ 
                                    color: selectedCategory ? 'black' : '#BFBFBF', 
                                    fontSize: 17,
                                    }}>{selectedCategory || 'Select Category'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Picker
                                        selectedValue={selectedCategory}
                                        onValueChange={(selectedCategory) => {
                                            handleCategorySelect(selectedCategory);
                                            setFieldValue('category', selectedCategory); // Update the 'category' field in form values
                                        }}
                                        style={styles.picker}
                                        mode='dropdown'
                                    >
                                        {categoryList && categoryList.map((item, index) => (
                                            <Picker.Item key={index} label={item.name} value={item.name} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </Modal>
                        
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                                <Text style={{fontWeight: '600', fontSize:15}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    </SafeAreaView>
  )
}

export default AddListingScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -18,
    },
    inputContainer:{
        marginHorizontal: 20,
        padding:10,
    },
    input:{
        borderWidth: 1,
        borderRadius: 10,
        padding:10,
        paddingHorizontal: 17,
        fontSize:17,
        marginTop:10
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    picker: {
        height: 200,
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
        width: 150,
        height: 40,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset:{
            width: 0,
            height: 2,
        }
    },
})