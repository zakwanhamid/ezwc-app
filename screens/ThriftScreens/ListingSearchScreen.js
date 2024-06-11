import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';

const ListingSearchScreen = () => {
  const route = useRoute();
  const { postsList, searchQuery } = route.params;
  console.log('postsList:', postsList);
  console.log('searchQuery:', searchQuery);


  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Search Listing</Text> 
            </View>
        </View>
        <View style={{margin:13}}>
            <Text style={{fontSize:16}}>Search results for item '{searchQuery}'</Text>
        </View>
        {postsList.length? 
        <View >
            <LatestItemList latestItemList={postsList} heading = {''}/>
        </View>       
        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No item found...</Text>
        </View>
        }
    </SafeAreaView>
  )
}

export default ListingSearchScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
    },
    header:{
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth:1,
        borderBottomColor: "#D8D9DB",
      },
    titleContainer:{
        flex:1,
        justifyContent: "center",
        alignItems:"center",
        marginLeft: -9,
    },
      emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
})