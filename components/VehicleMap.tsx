import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { MapPin, ExternalLink } from 'lucide-react-native';

interface VehicleMapProps {
  location: string;
}

export function VehicleMap({ location }: VehicleMapProps) {
  const handleOpenMap = () => {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    
    Linking.openURL(googleMapsUrl).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <TouchableOpacity style={styles.mapContainer} onPress={handleOpenMap}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={32} color="#DC2626" />
          <Text style={styles.locationText}>{location}</Text>
          <View style={styles.openMapButton}>
            <ExternalLink size={16} color="#DC2626" />
            <Text style={styles.openMapText}>Open in Maps</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2b',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#525353',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#404141',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#7F1D1D',
    borderRadius: 16,
  },
  openMapText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});