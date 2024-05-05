import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestItemList from '../ThriftScreen/LatestItemList';

export default function ListingList({currentUser}) {
    const [itemList,setItemList] = useState([]);

    useEffect(()=>{
        console.log('currentUSersds:', currentUser.id)
        getItemListByCurrentUser();
    },[])

    const getItemListByCurrentUser = async () => {
        setItemList([]);
        const q=query(collection(FIREBASE_DB, 'listings'),where('userId','==', currentUser.id));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const itemData = {
                id: doc.id, // Include the document ID in the data
                ...doc.data(),
            };
            console.log('doc:', itemData);
            setItemList(itemList => [...itemList, itemData]);
        });
    }

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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        margin: 30,
        fontSize: 18,
        color: 'gray',
    },
})