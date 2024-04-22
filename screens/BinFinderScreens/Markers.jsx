import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';


export default function Markers({index, place, centerOnMarker}) {
    const {selectedMarker,setSelectedMarker}=useContext(SelectMarkerContext);
  return (
    
    <Marker
        coordinate={{
        latitude:place.latitude,
        longitude:place.longitude,
        }}

        onPress={()=>setSelectedMarker(index)}
    >
        {selectedMarker==index?
      <Image source={require('../../assets/binMarker-selected.png')}
      style={{ width: 40, height: 50 }}
    />
      :<Image source={require('../../assets/binMarker.png')}
          style={{ width: 40, height: 50 }}
        />}
    </Marker>
  )
}