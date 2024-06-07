import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';
import { SafeAreaView } from 'react-native-safe-area-context';

const CatItemListScreen = ({route}) => {
    const {categoryData} = route.params;
    const navigation = useNavigation();
    const [itemList,setItemList] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
    };

    useEffect(()=>{
        getItemListByCategory();
    },[])

    const getItemListByCategory = async () => {
      const listingsCollection = query(collection(FIREBASE_DB, 'listings'),where('category','==', categoryData.name),orderBy('timestamp','desc'));
      const listingsSnapshot = await getDocs(listingsCollection);
      const listingsList = await Promise.all(
        listingsSnapshot.docs.map(async (listingDoc) => {
          const listingData = {
            id: listingDoc.id,
            ...listingDoc.data(),
          };
          const userDocRef = doc(FIREBASE_DB, 'users', listingData.userId);
            const userDocSnapshot = await getDoc(userDocRef);
      
            let userData = {};
            if (userDocSnapshot.exists()) {
              userData = {
                userId: userDocSnapshot.id,
                ...userDocSnapshot.data(),
              };
            } else {
              userData = {
                userId: listingData.userId,
                name: 'Unknown',
                email: 'Unknown',
                userHP: 'Unknown',
              };
            }
      
            return {
              id: listingData.id,
              image: listingData.image,
              title: listingData.title,
              price: listingData.price,
              category: listingData.category,
              desc: listingData.desc,
              time: listingData.timestamp,
              userId: userData.userId, // Include userId here
              userName: userData.name,
              userEmail: userData.email,
              userHP: userData.userHP,
            };
        })
      );

      setItemList(listingsList);
    };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>{categoryData.name} Items</Text>
            </View>
        </View>
        {itemList.length? 
        <View style={{paddingBottom:110}}>
            <LatestItemList latestItemList={itemList} heading = {''}/>
        </View>

        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No item available for this category...</Text>
        </View>
        }
        
    </SafeAreaView>
  )
}

export default CatItemListScreen

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