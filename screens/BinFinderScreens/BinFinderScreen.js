import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BinFinderScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text> This is BinFinderScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'
    },
  })

export default BinFinderScreen