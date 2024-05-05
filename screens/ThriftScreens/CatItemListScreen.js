import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';

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
        setItemList([]);
        const q=query(collection(FIREBASE_DB, 'listings'),where('category','==', categoryData.name));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc=>{
            console.log(doc.data());
            setItemList(itemList=>[...itemList, doc.data()]);
        })
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>{categoryData.name} Items</Text>
            </View>
        </View>
        {itemList.length? <LatestItemList latestItemList={itemList} 
        heading = {''}/>
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