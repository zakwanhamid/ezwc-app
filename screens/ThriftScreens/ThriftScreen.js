import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const ThriftScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
}, [navigation]);

  return (
    <View style={styles.container}>
      <Text>This is ThriftScreen</Text>
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

export default ThriftScreen