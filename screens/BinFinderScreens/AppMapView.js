import { View, Text, StyleSheet, Image } from 'react-native'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import React, { useContext } from 'react'
import { UserLocationContext } from '../../Context/UserLocationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markers from './Markers';

export default function AppMapView({data}) {

  
  const INITIAL_REGION = {
    latitude: 5.3556,
    longitude: 100.3025,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  }
  const {location, setLocation} = useContext(UserLocationContext);
   return location?.latitude&&(
    <View >
      <MapView 
      style={styles.map}
      provider={PROVIDER_GOOGLE} 
      customMapStyle={MapViewStyle}
      // initialRegion={INITIAL_REGION}                    
      showsUserLocation
      showsMyLocationButton
      region={{
        latitude:location?.latitude,
        longitude:location?.longitude,
        latitudeDelta:0.01,
        longitudeDelta:0.01
      }}
      >
        <Marker
          coordinate={{
            latitude:location?.latitude,
            longitude:location?.longitude,
          }}
        >

          {/* <Image
            source={require("../../assets/profilePic.jpeg")}
            style={{width:60, height: 60}}
          /> */}
          <MaterialCommunityIcons name="map-marker-account" size={50} color="black" />
        </Marker>

        {data&&data.map((item,index)=>
        (
          <Markers key={index}
          index={index}
          place={item}/>
        ))}
      </MapView>
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