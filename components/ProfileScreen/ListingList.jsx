import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestItemList from '../ThriftScreen/LatestItemList';

export default function ListingList({currentUser}) {
    const [itemList,setItemList] = useState([]);

    useEffect(()=>{
        console.log('currentUSersds:', currentUser.id)
        getItemListByCurrentUser();
    },[])

    const getItemListByCurrentUser = async () => {
        const listingsCollection = query(
          collection(FIREBASE_DB, 'listings'),
          where('userId', '==', currentUser.id)
        );
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
              userProfileImage: userData.profileImage
            };
          })
        );
      
        setItemList(listingsList);
      };
      

  return (
    <View >
      {itemList.length? <LatestItemList latestItemList={itemList} 
        heading = {''}/>
        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No listing available...</Text>
        </View>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        margin: 30,
        fontSize: 18,
        color: 'gray',
    },
})