import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListingDetailsScreen() {
    const {params} = useRoute();
    const [currentUser ,setCurrentUser] = useState([]);
    const navigation = useNavigation();
    const [product, setProduct] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState([]);
    const [reload, setReload] = useState(false);
    

    useEffect(() => {
        params&&setProduct(params.product);
        getCurrentUserDocument();
    },[params, reload])

    console.log('product.id:',product)

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
        if (!product.userHP) {
            console.error('User phone number not available.');
            return;
        }

        const whatsappLink = 'https://www.wasap.my/60' + product.userHP;
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
          const userRef = doc(FIREBASE_DB, 'users', currentUserUid); // Assuming currentUser has an 'id' fields
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
          setReload(!reload);
        } catch (error) {
          console.error('Error handling favorite listing:', error);
        }
    };

    const reportListing = async (listingId) => {
        try {
          const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      
          // Check if the user has already reported this post
          const reportsRef = collection(FIREBASE_DB, 'reportsListing');
          const q = query(reportsRef, where('listingId', '==', listingId), where('reportedBy', '==', currentUserUid));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            Alert.alert(
              'Already Reported',
              'You have already reported this listing.',
              [{ text: 'OK', onPress: () => {}, style: 'cancel' }],
              { cancelable: false }
            );
            return;
          }
      
          // Ask for confirmation before submitting a new report
          Alert.alert(
            'Confirm Report',
            'Are you sure you want to report this listing?',
            [
              { text: 'Cancel', onPress: () => console.log('Report cancelled'), style: 'cancel' },
              {
                text: 'Report',
                onPress: async () => {
                  try {
                    const reportData = {
                      listingId: listingId,
                      reportStat: 'pending', //pending or resolved
                      action: '', // deleted or ignored
                      reason: '', // Admin can fill this later
                      reportedBy: currentUserUid,
                      timestamp: serverTimestamp() // Optional: To track when the report was created
                    };
      
                    // Add the report to the "reports" collection
                    await addDoc(collection(FIREBASE_DB, 'reportsListing'), reportData);
      
                    Alert.alert(
                      'Report Submitted',
                      'Your report has been submitted and is pending review.',
                      [{ text: 'OK', onPress: () => {}, style: 'cancel' }],
                      { cancelable: false }
                    );
      
                    console.log('Report submitted:', reportData);
                  } catch (error) {
                    console.error('Error reporting listing:', error);
                    Alert.alert(
                      'Error',
                      'There was an error submitting your report. Please try again later.',
                      [{ text: 'OK', onPress: () => {}, style: 'cancel' }],
                      { cancelable: false }
                    );
                  }
                }
              }
            ],
            { cancelable: false }
          );
      
        } catch (error) {
          console.error('Error checking report status:', error);
          Alert.alert(
            'Error',
            'There was an error checking your report status. Please try again later.',
            [{ text: 'OK', onPress: () => {}, style: 'cancel' }],
            { cancelable: false }
          );
        }
    };


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
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
                    <View style={{ flexDirection: 'row' }}>
                    {currentUser.favListing ? (
                        <TouchableOpacity onPress={() => handleFavoriteListing(product.id)}>
                        <MaterialIcons name="favorite" size={27} color="#529C4E" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleFavoriteListing(product.id)}>
                        <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => reportListing(product.id)} style={{marginTop: 3, marginLeft:9}}>
                        <Octicons name="report" size={22} color="#529C4E" />
                    </TouchableOpacity>
                    </View>
                    )
            }
        </View>
        <ScrollView style={{flex:1}}>
            <View>
                <Image source={{uri:product.image}}
                    style={styles.productImg}/>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.titleTxt}>{product.title}</Text>
                        <Text style={styles.priceTxt}>RM {product.price}</Text>
                        <Text style={styles.catTxt}>{product.category}</Text>
                        <Text style={styles.descHeader}>Description</Text>
                        <Text style={styles.descTxt}>{product.desc}</Text>
                    </View>
            </View>

            <View style={styles.userContainer}>
              {product.userProfileImage?
                  <Image source={{uri:product.userProfileImage}} style={styles.postAvatar} />
                  :<Image source={require('../../assets/blankAvatar.webp')}
                  style={styles.postAvatar}
              />}
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
        marginLeft: 35,
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
    priceTxt:{
      fontSize: 24,
      fontWeight: '700',
      color: 'gray'
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