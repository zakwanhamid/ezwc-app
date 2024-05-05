import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Linking, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';

export default function ListingDetailsScreen() {
    const {params} = useRoute();
    const navigation = useNavigation();
    const [product, setProduct] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState([]);

    useEffect(() => {
        params&&setProduct(params.product);
        const currentUserId = FIREBASE_AUTH.currentUser.uid;
        setCurrentUserUid(currentUserId);
    },[params])

    console.log('product.id:',product.id)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
    };

    const handleOpenLink = async () => {
        if (!product.userPH) {
            console.error('User phone number not available.');
            return;
        }

        const whatsappLink = 'https://www.wasap.my/6' + product.userPH;
        console.log('whatsppLink:',whatsappLink)
        const supported = await Linking.canOpenURL(whatsappLink);
        if (supported) {
            await Linking.openURL(whatsappLink);
        } else {
            console.error('Unable to open WhatsApp link:', whatsappLink);
        }
    };

    const deleteListing = async (itemId) => {
        try {
            console.log('itemId:', itemId)
          // Show an alert to confirm deletion
          Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this item?',
            [
              {
                text: 'No',
                style: 'cancel',
                onPress: () => console.log('Deletion canceled'),
              },
              {
                text: 'Yes',
                onPress: async () => {
                  try {
                    // Construct a reference to the document you want to delete
                    const itemRef = doc(FIREBASE_DB, 'listings', itemId);
      
                    // Check if the document exists before attempting to delete it
                    const itemSnapshot = await getDoc(itemRef);
                    if (itemSnapshot.exists()) {
                        // Delete the document from Firestore
                        await deleteDoc(itemRef);
                        console.log('Document deleted successfully');
                    } else {
                      console.log('Document does not exist');
                    }
                  } catch (error) {
                    console.error('Error deleting document:', error);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        } catch (error) {
          console.error('Error showing alert:', error);
        }
      };


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Item Details</Text>
            </View>
            {product.userId === currentUserUid? (
            <TouchableOpacity onPress={() => deleteListing(product.id)}>
                <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>): null}
        </View>
        <View>
            <ScrollView>
                <View>
                    <Image source={{uri:product.image}}
                        style={styles.productImg}/>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.titleTxt}>{product.title}</Text>
                            <Text style={styles.catTxt}>{product.category}</Text>
                            <Text style={styles.descHeader}>Description</Text>
                            <Text style={styles.descTxt}>{product.desc}</Text>
                        </View>
                </View>

                <View style={styles.userContainer}>
                    <Image
                        source={require("../../assets/profilePic.jpeg")}
                        style={styles.postAvatar}
                    />
                    <View style={styles.userInfo}>
                        <View>
                            <Text style={styles.nameTxt}>{product.userName}</Text>
                            <Text style={styles.emailTxt}>{product.userEmail}</Text>
                        </View>
                        <TouchableOpacity onPress={handleOpenLink}>
                            <FontAwesome5 style={{marginRight: 20}} name="whatsapp" size={40} color="#529C4E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

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
        marginLeft: -10,
    },
    productImg:{
        height: 300,
        width: '100%',
    },
    detailsContainer:{
        padding: 20,
    },
    titleTxt:{
        fontSize: 24,
        fontWeight: '600'
    },
    catTxt:{
        marginBottom: 10,
        marginTop:5
    },
    descHeader:{
        marginTop:5,
        fontWeight: '600',
        fontSize: 18
    },
    descTxt:{
        fontSize: 17,
        color: 'gray',
    },
    postAvatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
    },
    userContainer:{
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginHorizontal:20,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    userInfo: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameTxt:{
        fontSize: 18,
        fontWeight: '500'
    },
    emailTxt:{
        color: 'gray'
    },
})