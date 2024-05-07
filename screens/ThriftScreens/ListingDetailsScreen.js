import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Linking, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ListingDetailsScreen() {
    const {params} = useRoute();
    const [currentUser ,setCurrentUser] = useState([]);
    const navigation = useNavigation();
    const [product, setProduct] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState([]);

    useEffect(() => {
        params&&setProduct(params.product);
        getCurrentUserDocument();
    },[params])

    console.log('product.id:',product.id)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    const handleProfileScreen = () => {
        navigation.navigate("ProfileScreen");
    };

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
    };

    // useEffect(() => {
    //     const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    //     const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
    
    //     const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
    //       if (documentSnapshot.exists()) {
    //         const userData = {
    //           id: documentSnapshot.id,
    //           ...documentSnapshot.data(),
    //         }; // Include user ID in userData
    //         setCurrentUser(userData);
    //       } else {
    //         // Handle case where user document doesn't exist
    //         console.log("User document does not exist");
    //       }
    //     });
    //     return () => unsubscribe();
    //   }, []);

    const getCurrentUserDocument = async () => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
      
        try {
          const userDocSnapshot = await getDoc(userRef);
          if (userDocSnapshot.exists()) {
            const userData = {
              id: userDocSnapshot.id,
              ...userDocSnapshot.data(),
            };
            console.log("User document:", userData);
            setCurrentUser(userData);
            console.log('curUSer:',currentUser.favListing)
            return userData; // Return the user document data
          } else {
            console.log("User document does not exist");
            return null; // Handle case where user document doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          return null; // Handle error fetching user document
        }
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
                        Alert.alert(
                            'Item Deleted',
                            'The item is removed. ');
                        handleProfileScreen();
                        
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

    const handleFavoriteListing = async (listingId) => {
        try {
          const currentUserUid = FIREBASE_AUTH.currentUser.uid;
          const userRef = doc(FIREBASE_DB, 'users', currentUserUid); // Assuming currentUser has an 'id' field
          console.log('listingId:',listingId)
    
          // Check if listingId is already in the favListing array
          if (currentUser.favListing.includes(listingId)) {
            // Remove binId from favListing arra
            const updatedFavListing = currentUser.favListing.filter(id => id !== listingId);
            await updateDoc(userRef, {
              favListing: updatedFavListing
            });
            console.log('Listing removed from favorites:', listingId);
            Alert.alert(
                'Item Removed',
                'This item is removed from your favourite items. ');
          } else {
            // Add listing to favListing array
            const updatedFavListing = [...currentUser.favListing, listingId];
            await updateDoc(userRef, {
              favListing: updatedFavListing
            });
            Alert.alert(
                'Item Added',
                'This item is added to your favourite listings. View your favourite items at Thrift homepage');
            console.log('Listing added to favorites:', listingId);
          }
        } catch (error) {
          console.error('Error handling favorite listing:', error);
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
            {
                product.userId === currentUser.id? (
                    <TouchableOpacity onPress={() => deleteListing(product.id)}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                ):(
                    currentUser.favListing ? (
                        <TouchableOpacity onPress={() => handleFavoriteListing(product.id)}>
                            <MaterialIcons name="favorite" size={27} color="#529C4E" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleFavoriteListing(product.id)}>
                            <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
                        </TouchableOpacity>
                    ))
            }
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