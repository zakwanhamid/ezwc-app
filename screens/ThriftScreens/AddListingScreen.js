import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { Formik } from 'formik';
import { FIREBASE_DB } from '../../firebase';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const AddListingScreen = () => {
    const [categoryList, setCategoryList]= useState([]); 
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

    const getCategoryList =  async() =>{
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'category'));
        querySnapshot.forEach((doc)=>{
            console.log("Docs:", doc.data());
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Add Listing</Text>
            </View>
        </View>
        <View>
            <Formik
             initialValues={{name:'', desc:'', category:'', address:'', price:'', image:''}}>

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
})