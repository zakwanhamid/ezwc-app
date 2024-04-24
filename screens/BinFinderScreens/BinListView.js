import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function BinListView({data}) {
    const flatListRef = useRef(null);
    const [currentUser ,setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
  const {selectedMarker,setSelectedMarker}=useContext(SelectMarkerContext);


    useEffect(()=>{
        selectedMarker&&scrollToIndex(selectedMarker)
     },[selectedMarker]) 
   
   
     const scrollToIndex=(index)=>{
       flatListRef.current?.scrollToIndex({animated:true,index})
     }

    useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);
        
    
        const unsubscribe = onSnapshot(userRef, documentSnapshot => {
            if (documentSnapshot.exists()) {
                const userData = documentSnapshot.data(); // Get user data directly
                setCurrentUser(userData);
                setLoading(false);
            } else {
                // Handle case where user document doesn't exist
                console.log("User document does not exist");
            }
            
        });
    
        return () => unsubscribe();
    }, []);

    const handleFavoriteBin = async (binId) => {
        try {
          const currentUserUid = FIREBASE_AUTH.currentUser.uid;
          const userRef = doc(FIREBASE_DB, 'users', currentUserUid); // Assuming currentUser has an 'id' field
          console.log('binId:',binId)
    
          // Check if binId is already in the favBin array
          if (currentUser.favBin.includes(binId)) {
            // Remove binId from favBin array
            const updatedFavBin = currentUser.favBin.filter(id => id !== binId);
            await updateDoc(userRef, {
              favBin: updatedFavBin
            });
            console.log('Bin removed from favorites:', binId);
          } else {
            // Add binId to favBin array
            const updatedFavBin = [...currentUser.favBin, binId];
            await updateDoc(userRef, {
              favBin: updatedFavBin
            });
            console.log('Bin added to favorites:', binId);
          }
        } catch (error) {
          console.error('Error handling favorite bin:', error);
        }
    };
    

  return (
    <View>
      <FlatList 
        data={data} 
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: Dimensions.get('window').width * 0.0001 }}
        renderItem={({item}) => (
        <View
            style={{
                backgroundColor: 'white',
                width: Dimensions.get('window').width,
                margin: 5,
                borderRadius: 10
                }}>
            <TouchableOpacity style={styles.favBtn} onPress={() => handleFavoriteBin(item.id)}>
                {currentUser.favBin.includes(item.id) ? (
                    <MaterialIcons name="favorite" size={27} color="#529C4E" />
                ) : (
                    <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
                )}
            </TouchableOpacity>
            
            <View style={{padding: 15, position: 'relative'}}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>

                <View style={{marginTop:5}}>
                    <Text style={{color: 'gray', fontSize: 17}}>No. of Bin Available</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginTop:2, fontSize: 20, fontWeight: 600}}>{item.binNum} </Text>
                        <Text style={{ color: 'gray' ,marginTop:2, fontSize: 20}}>({item.type}) </Text>
                    </View> 
                </View>
                <TouchableOpacity>
                    <View style={styles.locationArrow}>
                        <FontAwesome name="location-arrow" size={25} color="white"/>
                    </View>
                </TouchableOpacity>
            </View>
            

        </View>
      )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemTitle: {
        fontSize: 23,
        fontWeight: '800',
    },
    itemDescription: {
        color: 'gray',
        fontSize: 14,
    },
    locationArrow: {
        padding: 12,
        backgroundColor: "#529C4E",
        borderRadius: 6,
        paddingHorizontal: 16,
        width: 55,
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 10,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Adjust the height of the gradient as needed
    },
    favBtn: {
        position: 'absolute', 
        right: 0, 
        marginTop: 12, 
        marginRight: 25,
        zIndex: 1
    }
  });