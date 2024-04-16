import { View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import React from 'react'

export default function AppMapView() {
  return (
    <View >
      <MapView 
      style={styles.map}
      provider={PROVIDER_GOOGLE} 
      customMapStyle={MapViewStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });