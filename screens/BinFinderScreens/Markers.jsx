import { View, Text, Image } from 'react-native';
import React, { useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

export default function Markers({ index, place, centerOnMarker }) {
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);

  // Check if coordinates are valid
  if (!place.latitude || !place.longitude) {
    console.error('Invalid coordinates:', place);
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      onPress={() => {
        setSelectedMarker(index);
        if (centerOnMarker) {
          centerOnMarker(place);
        }
      }}
    >
      {selectedMarker === index ? (
        <Image
          source={require('../../assets/binMarker-selected.png')}
          style={{ width: 50, height: 60 }}
        />
      ) : (
        <Image
          source={require('../../assets/binMarker.png')}
          style={{ width: 50, height: 60 }}
        />
      )}
    </Marker>
  );
}
