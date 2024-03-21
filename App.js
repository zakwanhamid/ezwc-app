import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EvilIcons, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

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
    elevation: 0,
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
    </InsideStack.Navigator>
  );
}

function BinFinderLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="BinFinderScreen" component={BinFinderScreen}/>
    </InsideStack.Navigator>
  );
}
function ThriftLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="ThriftScreen" component={ThriftScreen}/>
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
  return ( 
    //bottom navbar
  <NavigationContainer>
    {user ? (
      <Tab.Navigator initialRouteName='Home' screenOptions={screenOptions} >
        <Tab.Screen 
          name="Home" 
          component={HomeLayout}
          options={{
            tabBarIcon:({focused})=>{
              return(
                <View style={{alignItems: "center", justifyContent: "center", marginTop: 24}}>
                  <Feather name="home" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, color: focused ? "#529c4e" : "black", marginTop:2,}}>Home</Text>
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
                <View style={{alignItems: "center", justifyContent: "center", marginTop: 24}}>
                  <Feather name="book-open" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, color: focused ? "#529c4e" : "black", marginTop:2,}}>Module</Text>
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
                    width: Platform.OS == "ios" ? 80 : 70,
                    height: Platform.OS == "ios" ? 80 : 70,
                    borderRadius: Platform.OS == "ios" ? 40 :40,
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: focused ? "white" :"#529c4e",
                    borderWidth: focused ? 2 : 0.5,
                    borderColor: focused ? "#529c4e" :"white",
                    shadowColor: "#000",
                    shadowOpacity: 0.9,
                    marginTop: 24,
                    shadowOffset:{
                        width: 0,
                        height: 2,
                    }
                    }}>
                  <EvilIcons name="trash" size={35} color={focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, color: focused ? "#529c4e" : "black", marginTop:2,}}>BinFinder</Text>
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
                <View style={{alignItems: "center", justifyContent: "center", marginTop: 24}}>
                  <Ionicons name="shirt-outline" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, color:focused ? "#529c4e" : "black", marginTop:2,}}>Thrift</Text>
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
                <View style={{alignItems: "center", justifyContent: "center", marginTop: 24}}>
                  <Octicons name="person" size={24} color= {focused ? "#529c4e" : "black"} />
                  <Text style={{fontSize:12, color:focused ? "#529c4e" : "black", marginTop:2,}}>Profile</Text>
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
  
  );
}
