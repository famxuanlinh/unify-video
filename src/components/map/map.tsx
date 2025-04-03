'use client';

import { MapConfig } from '@/configs';
import { toast } from '@/hooks';
import { toSlug } from '@/utils';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '../core';
import { AutoComplete } from './auto-complete';

export type Location = {
  position: Position;
  title: string;
  place_id: string;
};

export type Position = {
  lat: number;
  lng: number;
};

export const Map: React.FunctionComponent<{
  handleOnPlaceChange: (val: Location | null) => void;
  onMapLoaded: () => void;
  centerMarker?: Position;
  defaultZoom?: number;
  useDefaultMarker?: boolean;
  markerDraggable?: boolean;
  hideSearchBar?: boolean;
  leftChildren?: React.ReactNode;
}> = ({
  handleOnPlaceChange,
  onMapLoaded,
  centerMarker,
  defaultZoom,
  useDefaultMarker,
  markerDraggable = true,
  hideSearchBar,
  leftChildren
}) => {
  /*
   * Get place_id from lat lng
   */
  // let searchService: any = null;

  // useEffect(() => {
  //   // @ts-ignore
  //   const H = window.H;
  //   const platform = new H.service.Platform({
  //     apikey: MapConfig.HERE_MAP_API_KEY,
  //   });
  //   searchService = platform.getSearchService();
  // });

  const setLocation = (position: any) => {
    axios
      .get(
        'https://revgeocode.search.hereapi.com/v1/revgeocode?at=' +
          `${position.lat()},${position.lng()}` +
          '&lang=en-US&apiKey=' +
          MapConfig.HERE_MAP_API_KEY
      )
      .then((result: any) => {
        if (!result.data.items || result.data.items.length === 0) {
          handleOnPlaceChange(null);

          return;
        }
        result.data.items.map((item: any) => {
          const { countryCode } = item.address;
          const arr = [countryCode];
          const place_id = toSlug(arr.filter(e => !!e).join('_'));
          const loc: Location = {
            position: {
              lat: position.lat(),
              lng: position.lng()
            },
            place_id,
            title: item.address.label ?? item.title
          };

          console.log(
            'Location from reverseGeocode: ',
            JSON.stringify(loc, null, 2)
          );
          handleOnPlaceChange(loc);
        });
      });
  };

  /* ------------------------------------------- */

  const [mapLoadInterface, setMapLoadInterface] = useState<{
    mapApiLoaded: boolean;
    mapInstance: any;
    mapApi: any;
  }>({
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null
  });

  const [mapLoading, setMapLoading] = useState(mapLoadInterface.mapApiLoaded);
  useEffect(() => {
    setMapLoading(false);
  }, [mapLoadInterface.mapApiLoaded]);

  const apiHasLoaded = (map: any, maps: any) => {
    setMapLoadInterface({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    });
  };

  useEffect(() => {
    if (!mapLoadInterface.mapApiLoaded || !centerMarker) return;

    clearAllMarkers();
    createNewMarker(centerMarker);

    mapLoadInterface.mapInstance.setCenter({
      lat: centerMarker.lat,
      lng: centerMarker.lng
    });
    mapLoadInterface.mapInstance.setZoom(defaultZoom ?? 20);
    setLocation({
      lat: () => centerMarker.lat,
      lng: () => centerMarker.lng
    });
  }, [centerMarker, mapLoadInterface.mapApiLoaded]);

  /*
   * Working with Marker
   */

  const prevMarkersRef = useRef<any[]>([]);

  const createNewMarker = (position: any): any => {
    if (!mapLoadInterface.mapApiLoaded) return;
    const image_url = '/ep_location.svg';
    const marker = new mapLoadInterface.mapApi.Marker({
      position,
      map: mapLoadInterface.mapInstance,
      draggable: markerDraggable,
      icon: {
        url: useDefaultMarker ? undefined : image_url,
        scaledSize: new mapLoadInterface.mapApi.Size(82, 70)
      }
    });

    marker.addListener('dragend', () => {
      console.log(marker.getPosition());
      updateLabel(marker.getPosition());
    });

    prevMarkersRef.current.push(marker);
    console.log('Create new marker call');

    return marker;
  };

  const clearAllMarkers = () => {
    console.log('CLEAR ALL MARKERS ----');
    prevMarkersRef.current.map(val => val.setMap(null));
  };

  /*
   * AutoComplete
   */

  const addPlace = (place: any) => {
    clearAllMarkers();
    console.log('Debug update ', JSON.stringify(place));
    updateLabel(place.geometry.location);
    createNewMarker(place.geometry.location);
  };

  const updateLabel = (position: any) => {
    console.log('Debug update ', position);
    setLocation(position);
  };

  /*
   * Current location
   */
  const [curLoc, setCurLoc] = useState<any>();

  useEffect(() => {
    if (!mapLoadInterface.mapApiLoaded) return;
    if (!centerMarker) backToCurrentLocation();
    onMapLoaded();
    mapLoadInterface.mapInstance.addListener('contextmenu', (e: any) => {
      // const pos = {
      //     lat: e.latLng.lat(),
      //     lng: e.latLng.lng(),
      // };
      //
      // mapLoadInterface.mapInstance.setCenter(pos);
      // mapLoadInterface.mapInstance.setZoom(15);

      clearAllMarkers();
      updateLabel(e.latLng);
      setCurLoc(createNewMarker(e.latLng));
    });
  }, [mapLoadInterface.mapApiLoaded]);

  const backToCurrentLocation = () => {
    if (!mapLoadInterface.mapApiLoaded) return;
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          mapLoadInterface.mapInstance.setCenter(pos);
          mapLoadInterface.mapInstance.setZoom(15);
          if (curLoc) curLoc.setMap(null);
          updateLabel({ lat: () => pos.lat, lng: () => pos.lng });
          clearAllMarkers();
          setCurLoc(createNewMarker(pos));
        },
        () =>
          toast({
            description:
              'Please enable location permission to use this feature!'
          })
      );
    else
      toast({
        description: 'Please enable location permission to use this feature!'
      });
  };

  if (mapLoading) {
    return <p>Loading ....</p>;
  }

  return (
    <div className="gap-lg flex h-full w-full flex-col">
      {!hideSearchBar && mapLoadInterface.mapApiLoaded && (
        <div className="gap-sm md:gap-md flex flex-col items-center lg:flex-row">
          {leftChildren}
          <div className="flex flex-[1] items-end gap-[8px]">
            <AutoComplete
              map={mapLoadInterface.mapInstance}
              mapApi={mapLoadInterface.mapApi}
              addPlace={addPlace}
              //   label="Location"
              //   className={{ container: 'flex-[1]' }}
            />
            <Button
              type="button"
              className="h-[52px] w-[52px] rounded-md px-0"
              onClick={backToCurrentLocation}
            >
              Send
            </Button>
          </div>
        </div>
      )}
      <div className="relative size-full">
        <GoogleMapReact
          defaultZoom={defaultZoom ?? 10}
          defaultCenter={MapConfig.DEFAULT_CENTER}
          bootstrapURLKeys={{
            key: MapConfig.GOOGLE_MAP_API_KEY,
            libraries: ['places', 'geometry'],
            language: 'en'
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }: { map: any; maps: any }) =>
            apiHasLoaded(map, maps)
          }
          options={{
            mapTypeId: 'roadmap',
            mapTypeControl: true
          }}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
