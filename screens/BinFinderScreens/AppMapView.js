import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import React, { useContext, useRef } from 'react';
import { UserLocationContext } from '../../Context/UserLocationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markers from './Markers';

export default function AppMapView({ data, centerOnMarker }) {
  const mapViewRef = useRef(null);
  const { location } = useContext(UserLocationContext);

  return location?.latitude && (
    <View>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        showsUserLocation
        showsMyLocationButton
        region={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
        >
          <MaterialCommunityIcons name="map-marker-account" size={50} color="black" />
        </Marker>

        {data && data.map((item, index) => {
          const { latitude, longitude } = item;
          if (latitude && longitude) {
            return (
              <Markers
                key={index}
                index={index}
                place={item}
                centerOnMarker={centerOnMarker}
              />
            );
          }
          return null;
        })}
      </MapView>
    </View>
  );
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
