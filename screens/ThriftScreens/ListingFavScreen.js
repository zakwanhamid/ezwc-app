import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';

const ListingFavScreen = ({route}) => {
    const [itemList,setItemList] = useState([]);
    const {currentUser} = route.params;

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
        console.log('curretnUSerfav:',currentUser)
    };


    useEffect(() => {
        getItemListByListingIds(currentUser.favListing);
    },[]);

    const getItemListByListingIds = async (listingIdsArray) => {
        console.log('listingIdsArray:', listingIdsArray);
        setItemList([]);
        try {
            const q = query(
                collection(FIREBASE_DB, 'listings'), 
                where('__name__', 'in', listingIdsArray),
                orderBy('timestamp','desc')
                );
            const snapshot = await getDocs(q);
            
            snapshot.forEach(doc => {
                const itemData = {
                    id: doc.id, // Include the document ID in the data
                    ...doc.data(),
                };
                console.log('doc:', itemData);
                setItemList(itemList => [...itemList, itemData]);
            });
        } catch (error) {
            console.error('Error fetching item list by IDs:', error);
        }
    };


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Favourite Items</Text>
            </View>
        </View>
        {itemList.length? <LatestItemList latestItemList={itemList} 
        heading = {''}/>
        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No item in your favourite...</Text>
        </View>
        }
        
    </SafeAreaView>
  )
}

export default ListingFavScreen

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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
})