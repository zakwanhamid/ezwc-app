import { View, Text, TouchableOpacity, Button, StyleSheet, Image, ScrollView, Modal, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, collection, onSnapshot, where, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingList from '../../components/ProfileScreen/ListingList';
import PostList from '../../components/ProfileScreen/PostList';


//this is profile screen that is unique for every user
const ProfileScreen = () => {

  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [active,setActive] = useState(0);
  
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

    useEffect(() => {
      if (currentUser && currentUser.following) {
        setFollowingCount(currentUser.following.length);
      } else {
        setFollowingCount(0);
      }
    }, [currentUser, currentUser.following]);
  
    useEffect(() => {
      if (currentUser && currentUser.followers) {
        setFollowersCount(currentUser.followers.length);
      } else {
        setFollowersCount(0);
      }
    }, [currentUser, currentUser.followers]);

    // Define fetchData function
    const fetchData = async (idsArray, setDataFunc) => {
      try {
          const dataPromises = idsArray.map(async (id) => {
              const docRef = doc(collection(FIREBASE_DB, 'users'), id);
              const docSnapshot = await getDoc(docRef);
        
              if (docSnapshot.exists()) {
                return { id: docSnapshot.id, ...docSnapshot.data() };
              } else {
                return null;
              }
            });
        
            const data = await Promise.all(dataPromises);
            const filteredData = data.filter((item) => item !== null);
            setDataFunc(filteredData);
      } catch (error) {
      console.error('Error fetching data:', error);
      } finally {
      setLoading(false);
      }
  };
  
    // Inside your component
    useEffect(() => {
        if (currentUser.followers) {
        fetchData(currentUser.followers, setFollowersData);
        }
    }, [currentUser.followers]);
    
    useEffect(() => {
        if (currentUser.following) {
        fetchData(currentUser.following, setFollowingData);
        }
    }, [currentUser.following]);

    const renderFollowerItem = ({ item }) => (
      <View style={styles.profiles}>
          {item.profileImage?
            <Image source={{uri:item.profileImage}} style={styles.profilesAvatar} />
            :<Image source={require('../../assets/blankAvatar.webp')}
            style={styles.profilesAvatar}
          />}
          <View style={{marginVertical:14, marginLeft: 10,}}>
              <Text style={{fontSize:16, fontWeight: 600,}}>{item.name}</Text>
              <Text style={{fontSize:13, fontWeight: 300, marginTop: 2}}>{item.email}</Text>
          </View>
      </View>
  );


  const renderFollowingItem = ({ item }) => (
      <View style={styles.profiles}>
          {item.profileImage?
            <Image source={{uri:item.profileImage}} style={styles.profilesAvatar} />
            :<Image source={require('../../assets/blankAvatar.webp')}
            style={styles.profilesAvatar}
          />}
          <View style={{marginVertical:14, marginLeft: 10,}}>
              <Text style={{fontSize:16, fontWeight: 600,}}>{item.name}</Text>
              <Text style={{fontSize:13, fontWeight: 300, marginTop: 2}}>{item.email}</Text>
          </View>
      </View>
  );

  

  const renderPostContent = () => {
      return (
          <View>
              <PostList currentUser = {currentUser}/>
          </View>
          
      );
    };
      
      const renderListingContent = () => {
        return (
          <View>
              <ListingList currentUser = {currentUser}/>
          </View>
        );
      };


      useEffect(() => {
        const currentUserUid = FIREBASE_AUTH.currentUser.uid;
        const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);
    
        const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            const userData = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            }; // Include user ID in userData
            setCurrentUser(userData);
          } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
          }
        });
        return () => unsubscribe();
      }, []);

  return (
    <SafeAreaView style={{backgroundColor:'white'}}>
        <View style={{width:"100%"}}>
        {currentUser.wallpaperImage?
            <Image source={{uri:currentUser.wallpaperImage}} style={styles.bgImage} />
            :<Image source={require('../../assets/blankWallpaper.jpeg')}
            style={styles.bgImage}
            />}
        </View>

        {/* avatar and button */}
        <View style={styles.avatarBtn}>
            {currentUser.profileImage?
            <Image source={{uri:currentUser.profileImage}} style={styles.avatar} />
            :<Image source={require('../../assets/blankAvatar.webp')}
            style={styles.avatar}
            />}
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity style={styles.editBtn}>
                  <Text onPress={handleEditProfile} style={{ fontWeight:"700", fontSize:14}}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => FIREBASE_AUTH.signOut()} title="Logout"
                  style={styles.editBtn}>
                  <Text style={{ fontWeight:"700", fontSize:14, color:"black"}}>Log Out</Text>
              </TouchableOpacity>     
            </View>
        </View>

        {/* name, email, bio, following, followers */}
        <View style={{marginTop:10,marginHorizontal: 17}}>
            <Text style={{fontSize:17, fontWeight :900}}>{currentUser.name}</Text>
            <Text style={{fontSize:15, fontWeight :200, marginTop:3}}>{currentUser.email}</Text>
            <Text style={{fontSize:15, marginTop:6}}>
                {currentUser.bio}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 5}}>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => setIsFollowingModalVisible(true)} >
                    <Text style={{fontSize:15, fontWeight :700}}>{followingCount}</Text>
                    <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => setIsFollowersModalVisible(true)}>
                    <Text style={{fontSize:15, fontWeight :700, marginLeft:10}}>{followersCount}</Text>
                    <Text style={{fontSize:15, fontWeight :300, marginLeft:5}}>Followers</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setActive(0)}
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 0 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17,}}>Post</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => setActive(1)} 
            style={{
                width: "50%", 
                alignItems: "center",
                padding: 10,
                borderBottomWidth: active === 1 ? 2 : 0,
                borderBottomColor: "#529C4E"
                }}>
                <Text style={{fontSize: 17}}>Listing</Text>
            </TouchableOpacity>
        </View>
            {active === 0 && renderPostContent()}
            {active === 1 && renderListingContent()}    


            <Modal
            visible={isFollowersModalVisible} 
            onRequestClose={() => setIsFollowersModalVisible(false)}
            animationType='fade'
            transparent={true}
        >
            <View style={styles.modalBg}>
            <View style = {styles.modalContainer}>
                <Text style={[styles.modalHeader, {fontWeight: 700}]}>Followers</Text>
                <Text style={[styles.modalTitle, {fontWeight: 500, marginBottom: 20,}]}>Below are your followers</Text>
                <FlatList
                style={{width: '90%', height: 200}}
                data={followersData}
                keyExtractor={(item) => item.id}
                renderItem={renderFollowerItem}
                />
                <TouchableOpacity style={[styles.closeBtn, {marginTop: 20,}]} onPress={() => setIsFollowersModalVisible(false)}>
                <Text> Close </Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>

        <Modal
            visible={isFollowingModalVisible} 
            onRequestClose={() => setIsFollowingModalVisible(false)}
            animationType='fade'
            transparent={true}
        >
            <View style={styles.modalBg}>
            <View style = {styles.modalContainer}>
                <Text style={[styles.modalHeader, {fontWeight: 700}]}>Following</Text>
                <Text style={[styles.modalTitle, {fontWeight: 500, marginBottom: 20,}]}>Below are your following</Text>
                <FlatList
                style={{width: '90%', height: 200}}
                data={followingData}
                keyExtractor={(item) => item.id}
                renderItem={renderFollowingItem}
                />
                <TouchableOpacity style={[styles.closeBtn, {marginTop: 20,}]} onPress={() => setIsFollowingModalVisible(false)}>
                <Text> Close </Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // marginTop:80,
  },
  avatarBtn:{
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop:5,
  },
  titleContainer:{
    flex:1,
    justifyContent: "center",
    alignItems:"center",
    marginLeft: 70,
  },
  editBtn:{
    backgroundColor: "#529C4E",
    width: 70,
    height: 30,
    marginLeft: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    elevation: 5,
    shadowOpacity: 0.5,
    shadowOffset:{
        width: 0,
        height: 2,
    }
  },
  bgImage:{
      height:100,
      width: "100%"
  },
  avatar: {
      width:90,
      height:90,
      borderRadius: 50,
      borderColor: "white",
      borderWidth: 2,
      marginTop: -50,
  },
  tabBar: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#D8D9DB",
      justifyContent: "space-between",
  },
  button: {
      width: "50%", 
      alignItems: "center",
      padding: 10,
      borderBottomColor: "#529C4E"
  },
  buttonText: {
      fontSize: 16,
      marginLeft: 8,
  },
  modalBg: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer:{
    width: '80%',
    backgroundColor: 'white',
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    alignItems:'center'
  },
  modalHeader:{
    fontSize: 20, 
  },
  modalTitle:{
    fontSize: 18,
  },
  modalSumm:{
    fontSize: 16,
    marginTop: 20,
  },
  closeBtn:{
    backgroundColor: "#529C4E",
    width: 100,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset:{
        width: 0,
        height: 2,
    }
  },
  profiles:{
    flexDirection: "row",
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

export default ProfileScreen