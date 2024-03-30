import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileSearchScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  }
  const handleUserProfile = (item) => {
    navigation.navigate('UserProfileScreen', { userId: item.id});
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by name
      user.email.toLowerCase().startsWith(searchQuery.toLowerCase()) // Filter by email
  );

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(FIREBASE_DB, 'users'));
        const querySnapshot = await getDocs(usersQuery);

        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });

        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderProfileItem =({item}) => (
    <TouchableOpacity onPress={() => handleUserProfile(item)}>
      <View style={styles.profiles}>
          <Image source={require("../../assets/profilePic.jpeg")} style={styles.profilesAvatar}></Image>
          <View style={{marginVertical:14, marginLeft: 10,}}>
              <Text style={{fontSize:16, fontWeight: 600,}}>{item.name}</Text>
              <Text style={{fontSize:13, fontWeight: 300, marginTop: 2}}>{item.email}</Text>
          </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Search User Profile</Text> 
            </View>
        </View>
        <View style={styles.searchBarContainer}>
            <TextInput 
            placeholder='Search' 
            clearButtonMode='always' 
            autoCapitalize='none'
            style={styles.searchBar}
            autoCorrect={false}
            // value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            />
        </View>
          <FlatList 
          data={filteredUsers} 
          keyExtractor={(item) => item.id} 
          renderItem={renderProfileItem}/>
    </SafeAreaView>
    
  )
}

export default ProfileSearchScreen

const styles = StyleSheet.create({
    container:{
        flex:1
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
    searchBarContainer:{
        margin:10,
    },
    searchBar:{
        paddingHorizontal: 20,
        paddingVertical:10,
        borderColor: '#ccc',
        borderWidth:1,
        borderRadius:8,
    },
    profiles:{
        flexDirection: "row",
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    profilesAvatar:{
        width: 60,
        height:60,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 2,
    },
    
})