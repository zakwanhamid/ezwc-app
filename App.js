import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

//screens
import Login from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { FIREBASE_AUTH } from './firebase';
import ProfileScreen from './screens/ProfileScreen';


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return (
    <InsideStack.Navigator>
      {/* <InsideStack.Screen name="HomeScreen" component={HomeScreen}/> */}
      <InsideStack.Screen  name="ProfileScreen" component={ProfileScreen}/>
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
        <Stack.Screen options={{ headerShown: false }} name="Inside" component={InsideLayout}/>
        ):(
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login}/>
        )}

        {/* Screeens */}
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
    
  ;
}
