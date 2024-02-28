import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen';
import ModuleScreen from '../screens/ModuleScreen';
import BinFinderScreen from '../screens/BinFinderScreen';
import ThriftScreen from '../screens/ThriftScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="HomeScreen" component={HomeScreen}/>
        <Tab.Screen name="ModuleScreen" component={ModuleScreen}/>
        <Tab.Screen name="BinFinderScreen" component={BinFinderScreen}/>
        <Tab.Screen name="ThriftScreen" component={ThriftScreen}/>
        <Tab.Screen name="ProfileScreen" component={ProfileScreen}/>

    </Tab.Navigator>
  )
}

export default Tabs;