'use client';

import { MapConfig } from '@/configs';
import { Map } from '@vis.gl/react-google-maps';
import React, { useRef, useState } from 'react';

import { LocationIcon } from '../icons';
import { Autocomplete, AutocompleteCustomRef } from './autocomplete';
import AutocompleteResult from './autocomplete-result';
interface GoogleMapProps {
  lat?: number;
  long?: number;
  onGetCoordinate: (values: { lat: number; long: number }) => void;
}

export const GoogleMap = ({ lat, long, onGetCoordinate }: GoogleMapProps) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null);

  const autocompleteRef = useRef<AutocompleteCustomRef>(null);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');

      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        autocompleteRef.current?.setPlaceByLatLng(latitude, longitude);
      },
      error => {
        alert('Unable to retrieve your location.');
        console.error(error);
      }
    );
  };

  React.useEffect(() => {
    if (lat != null && long != null) {
      autocompleteRef.current?.setPlaceByLatLng(lat, long);
    }
  }, [lat, long]);

  return (
    <>
      <Map
        mapId={MapConfig.HERE_MAP_API_KEY}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="relative h-full max-h-83 [&>div]:rounded-2xl"
      >
        <AutocompleteResult place={selectedPlace} />
        <button
          type="button"
          onClick={handleMyLocation}
          className="text-label-l text-dark-grey border-dark-grey absolute right-0 bottom-5 left-0 m-auto mx-7 flex items-center justify-center gap-2 rounded-lg border-2 bg-white px-3 py-1"
        >
          <LocationIcon /> Go to current location
        </button>
      </Map>

      <Autocomplete
        onGetCoordinate={onGetCoordinate}
        ref={autocompleteRef}
        onPlaceSelect={setSelectedPlace}
      />
    </>
  );
};
