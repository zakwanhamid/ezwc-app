import { ActivityIndicator, Alert, Image, Modal,ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation schema
import { Picker } from '@react-native-picker/picker'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddListingScreen = () => {
    const [categoryList, setCategoryList]= useState([{ name: 'Select Category' }]); 
    const [currentUser, setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceInput, setPriceInput] = useState('');

    const navigation = useNavigation();
    const route = useRoute();
    const { onUpdate } = route.params;

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

    const handleThriftScreen = () => {
        navigation.navigate("ThriftScreen");
    };

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
            console.log(userData.email)
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
    }, []);

    //used to get category list
    const getCategoryList = async () => {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'category'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            console.log("Docs:", doc.data());
            categories.push(doc.data());
        });
        setCategoryList(categories);
    };


    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setModalVisible(false);
    }

    // Used to Pick Image from gallery
    const pickImage = async (setFieldValue) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setFieldValue('image', result.assets[0].uri);
        }
    };

    const formatPriceInput = (input) => {
        // Remove non-digit characters
        const cleanedInput = input.replace(/[^0-9]/g, '');
    
        // Convert to a number and divide by 100 to get the decimal format
        const numericValue = Number(cleanedInput) / 100;
    
        // Return the value formatted to two decimal places
        return numericValue.toFixed(2);
    };
    

    const onSubmitMethod = async (values) => {
        try {
            setLoading(true);
    
            // Convert URI to blob file
            console.log('images:', values.image);
    
            const resp = await fetch(values.image);
            const blob = await resp.blob();
            const storageRef = ref(FIREBASE_STORAGE, 'listing-imgs/' + Date.now() + ".jpg");
    
            const snapshot = await uploadBytes(storageRef, blob);
            console.log('Uploaded a blob or file!', snapshot);
    
            const downloadUrl = await getDownloadURL(storageRef);
            console.log(downloadUrl);
    
            // Add the image URL and userId to the value
            values.image = downloadUrl;
            values.userId = currentUser.id;
    
            const docRef = await addDoc(collection(FIREBASE_DB, "listings"), values);
            if (docRef.id) {
                console.log('Listing successfully added with ID:', docRef.id);
                setLoading(false);
                Alert.alert('Successfully Added', "Your listing is successfully added. This listing will be view by other users");
                if (onUpdate) {
                    onUpdate(); // Call the onUpdate function
                }

                handleThriftScreen();
            }
        } catch (error) {
            console.error('Error adding listing:', error);
            setLoading(false);
            Alert.alert('Error', 'There was an error adding your listing. Please try again.');
        }
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        desc: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        location: Yup.string().required('Location is required'),
        price: Yup.string().required('Price is required'),
        image: Yup.string().required('Image is required'),
    });
    

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Add New Listing</Text>
            </View>
        </View>
        <KeyboardAvoidingView
            
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.inputContainer}>
            <View style={{marginVertical:15}}>
                <Text style={{fontSize:26, fontWeight: '700'}}>Advertise Your Used Item!</Text>
                <Text style={{fontSize:16, color: 'gray', fontWeight: '500' }}>Create New Post and Start Selling.</Text>
            </View>
            
            <Formik
             initialValues={{title:'', desc:'', category:'', location:'', price:'', image:'', userId: ``, timestamp:new Date()}}
             onSubmit={value => {
                // Handle form submission
                if (!value.image) {
                    Alert.alert('Alert!', 'Please select an image.', [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
                    return;
                }
                onSubmitMethod(value);
            }}
            validationSchema={validationSchema}
            >
                {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched})=>(
                    <View>
                        <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
                        {values.image ?
                            <Image source={{ uri: values.image }} style={{ height: 100, width: 100, borderRadius: 15 }} />
                            :
                            <Image source={require('../../assets/imgPlaceholder.jpeg')}
                                style={{ height: 100, width: 100, borderRadius: 15 }}
                            />
                        }
                            
                        </TouchableOpacity>
                        {errors.image && touched.image && <Text style={styles.errorText}>{errors.image}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder='Title'
                            value={values?.title}
                            onChangeText={handleChange('title')}
                            maxLength={30}
                        />
                        {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        <TextInput
                            style={[styles.input,{height: 100, paddingTop:15}]}
                            placeholder='Description'
                            value={values?.desc}
                            onChangeText={handleChange('desc')}
                            maxLength={200}
                            multiline
                        />
                        {errors.desc && touched.desc && <Text style={styles.errorText}>{errors.desc}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder='Price (RM)'
                            value={priceInput}
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                const formattedPrice = formatPriceInput(text);
                                setPriceInput(formattedPrice);
                                setFieldValue('price', formattedPrice);
                            }}
                            maxLength={7} // Adjust as needed
                        />
                        {errors.price && touched.price && <Text style={styles.errorText}>{errors.price}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder='Location'
                            value={values?.location}
                            onChangeText={handleChange('location')}
                            maxLength={50}
                        />
                        {errors.location && touched.location && <Text style={styles.errorText}>{errors.location}</Text>}
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
                            {errors.category && touched.category && <Text style={styles.errorText}>{errors.category}</Text>}
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
                                        <Picker.Item label="Select Category" value="" color="#BFBFBF" />
                                        {categoryList && categoryList.map((item, index) => (
                                            <Picker.Item key={index} label={item.name} value={item.name} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </Modal>

                        
                        <View style={styles.btnContainer}>
                            <TouchableOpacity 
                                style={[styles.btn,{backgroundColor: loading? '#ccc':'#529C4E'}]} 
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading?
                                <ActivityIndicator color='white'/> :
                                <Text style={{fontWeight: '600', fontSize:15,}}>Submit</Text>
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        flex: 1,
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
    errorText: {
        fontSize: 14,
        color: 'red',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 5,
    },
})
