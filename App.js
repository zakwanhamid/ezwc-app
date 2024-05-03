import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EvilIcons, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import * as Location from 'expo-location';


//screens
import Login from './screens/LoginScreen';
import HomeScreen from './screens/FeedScreens/HomeScreen';
import ProfileScreen from './screens/ProfileScreens/ProfileScreen';
import ModuleScreen from './screens/ModuleScreens/ModuleScreen';
import BinFinderScreen from './screens/BinFinderScreens/BinFinderScreen';
import ThriftScreen from './screens/ThriftScreens/ThriftScreen';
import CreatePostScreen from './screens/FeedScreens/CreatePostScreen';
import EditProfileScreen from './screens/ProfileScreens/EditProfileScreen';
import ModuleBgScreen from './screens/ModuleScreens/ModuleBgScreen';
import ModuleObjScreen from './screens/ModuleScreens/ModuleObjScreen';
import ModuleInstrucScreen from './screens/ModuleScreens/ModuleInstrucScreen';
import ModuleRMScreen from './screens/ModuleScreens/ModuleRMScreen';
import ModuleFacListScreen from './screens/ModuleScreens/ModuleFacListScreen';
import ModuleF1Screen from './screens/ModuleScreens/FactorsScreens/ModuleF1Screen';
import ModuleF2Screen from './screens/ModuleScreens/FactorsScreens/ModuleF2Screen';
import ModuleF3Screen from './screens/ModuleScreens/FactorsScreens/ModuleF3Screen';
import ModuleF4Screen from './screens/ModuleScreens/FactorsScreens/ModuleF4Screen';
import ModuleF5Screen from './screens/ModuleScreens/FactorsScreens/ModuleF5Screen';
import ModuleF6Screen from './screens/ModuleScreens/FactorsScreens/ModuleF6Screen';
import ModuleF7Screen from './screens/ModuleScreens/FactorsScreens/ModuleF7Screen';
import ModuleF8Screen from './screens/ModuleScreens/FactorsScreens/ModuleF8Screen';
import ModuleF9Screen from './screens/ModuleScreens/FactorsScreens/ModuleF9Screen';
import ModuleF10Screen from './screens/ModuleScreens/FactorsScreens/ModuleF10Screen';
import ModuleFacSummScreen from './screens/ModuleScreens/ModuleFacSummScreen';
import ModuleQuizScreen from './screens/ModuleScreens/ModuleQuizScreen';
import ModuleFeedbackScreen from './screens/ModuleScreens/ModuleFeedbackScreen';
import ProfileSearchScreen from './screens/ProfileScreens/ProfileSearchScreen';
import UserProfileScreen from './screens/ProfileScreens/UserProfileScreen';
import { UserLocationContext } from './Context/UserLocationContext';
import BinFavScreen from './screens/BinFinderScreens/BinFavScreen';
import AddListingScreen from './screens/ThriftScreens/AddListingScreen';
import CatItemListScreen from './screens/ThriftScreens/CatItemListScreen';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle:{
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 70,
  }
}

const InsideStack = createNativeStackNavigator();

function HomeLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomeScreen" component={HomeScreen} />
      <InsideStack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <InsideStack.Screen name="ProfileSearchScreen" component={ProfileSearchScreen} />
      <InsideStack.Screen name="UserProfileScreen" component={UserProfileScreen} />
    </InsideStack.Navigator>
  );
}

function ProfileLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="ProfileScreen" component={ProfileScreen}/>
      <InsideStack.Screen name="EditProfileScreen" component={EditProfileScreen} />

    </InsideStack.Navigator>
  );
}

function ModuleLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="ModuleScreen" component={ModuleScreen}/>
      <InsideStack.Screen name="ModuleBgScreen" component={ModuleBgScreen} />
      <InsideStack.Screen name="ModuleObjScreen" component={ModuleObjScreen} />
      <InsideStack.Screen name="ModuleInstrucScreen" component={ModuleInstrucScreen} />
      <InsideStack.Screen name="ModuleRMScreen" component={ModuleRMScreen} />
      <InsideStack.Screen name="ModuleFacListScreen" component={ModuleFacListScreen} />
      <InsideStack.Screen name="ModuleF1Screen" component={ModuleF1Screen} />
      <InsideStack.Screen name="ModuleF2Screen" component={ModuleF2Screen} />
      <InsideStack.Screen name="ModuleF3Screen" component={ModuleF3Screen} />
      <InsideStack.Screen name="ModuleF4Screen" component={ModuleF4Screen} />
      <InsideStack.Screen name="ModuleF5Screen" component={ModuleF5Screen} />
      <InsideStack.Screen name="ModuleF6Screen" component={ModuleF6Screen} />
      <InsideStack.Screen name="ModuleF7Screen" component={ModuleF7Screen} />
      <InsideStack.Screen name="ModuleF8Screen" component={ModuleF8Screen} />
      <InsideStack.Screen name="ModuleF9Screen" component={ModuleF9Screen} />
      <InsideStack.Screen name="ModuleF10Screen" component={ModuleF10Screen} />
      <InsideStack.Screen name="ModuleFacSummScreen" component={ModuleFacSummScreen} />
      <InsideStack.Screen name="ModuleQuizScreen" component={ModuleQuizScreen} />
      <InsideStack.Screen name="ModuleFeedbackScreen" component={ModuleFeedbackScreen} />

    </InsideStack.Navigator>
  );
}

function BinFinderLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="BinFinderScreen" component={BinFinderScreen}/>
      <InsideStack.Screen name="BinFavScreen" component={BinFavScreen}/>
    </InsideStack.Navigator>
  );
}
function ThriftLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="ThriftScreen" component={ThriftScreen}/>
      <InsideStack.Screen name="AddListingScreen" component={AddListingScreen}/>
      <InsideStack.Screen name="CatItemListScreen" component={CatItemListScreen}/>
    </InsideStack.Navigator>
  );
}



export default function App() {
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, [])

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log('location:',location)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return ( 
    //bottom navbar
    //make the location accessible to other screen
  <UserLocationContext.Provider 
    value={{location, setLocation}}>

  <NavigationContainer>
    {user ? (
      <Tab.Navigator initialRouteName='Home' screenOptions={screenOptions} >
        <Tab.Screen 
          name="Home" 
          component={HomeLayout}
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{alignItems: "center", justifyContent: "center", marginTop:24}}>
                  <Feather name="home" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, fontWeight: 700, color: focused ? "#529c4e" : "black", marginTop:2,}}>Home</Text>
                </View>
              )
            }
          }} />
        <Tab.Screen 
          name="Module" 
          component={ModuleLayout}
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{alignItems: "center", justifyContent: "center", marginTop:24}}>
                  <Feather name="book-open" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, fontWeight: 700, color: focused ? "#529c4e" : "black", marginTop:2,}}>Module</Text>
                </View>
              )
            }
          }} />
        <Tab.Screen 
          name="BinFinder" 
          component={BinFinderLayout} 
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{
                    top: Platform.OS == "ios" ? -10 :-20,
                    width: Platform.OS == "ios" ? 80 : 80,
                    height: Platform.OS == "ios" ? 80 : 80,
                    borderRadius: Platform.OS == "ios" ? 40 :40,
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: focused ? "white" :"#529c4e",
                    borderWidth: focused ? 2 : 1,
                    borderColor: focused ? "#529c4e" :"white",
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOpacity: 0.9,
                    shadowOffset:{
                        width: 0,
                        height: 2,
                    }
                    }}>
                  <EvilIcons name="trash" size={35} color={focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12,fontWeight: 700, color: focused ? "#529c4e" : "black", marginTop:2,}}>BinFinder</Text>
                </View>
              )
            }
          }}/>
        <Tab.Screen 
          name="Thrift" 
          component={ThriftLayout} 
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{alignItems: "center", justifyContent: "center", marginTop:24}}>
                  <Ionicons name="shirt-outline" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12,fontWeight: 700, color:focused ? "#529c4e" : "black", marginTop:2,}}>Thrift</Text>
                </View>
              )
            }
          }}/>
        <Tab.Screen 
          name="Profile" 
          component={ProfileLayout}
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{alignItems: "center", justifyContent: "center", marginTop:24}}>
                  <Octicons name="person" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12,fontWeight: 700, color:focused ? "#529c4e" : "black", marginTop:2,}}>Profile</Text>
                </View>
              )
            }
          }} />
      </Tab.Navigator>
    ) : (
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    )}
  </NavigationContainer>
  </UserLocationContext.Provider>
  
  );
}
