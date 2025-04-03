'use client';

import React, { FC, useCallback, useEffect, useRef } from 'react';

import { Input } from '../core';

interface AutoComplete {
  map: any;
  mapApi: any;
  addPlace: any;
}

export const AutoComplete: FC<AutoComplete> = ({
  map,
  mapApi,
  addPlace,
  ...props
}) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const onPlaceChanged = useCallback(() => {
    const place = autoComplete.getPlace();

    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addPlace(place);
  }, []);

  let autoComplete: any = null;

  useEffect(() => {
    autoComplete = new mapApi.places.Autocomplete(searchInput.current, {});
    autoComplete.addListener('place_changed', onPlaceChanged);
    autoComplete.bindTo('bounds', map);
  }, [searchInput, onPlaceChanged]);

  return (
    <Input
      placeholder="Search Location"
      ref={searchInput}
      onKeyUp={e => {
        if (e.key == 'Enter') {
          e.preventDefault();

          return false;
        }
      }}
      onKeyDown={e => {
        if (e.key == 'Enter') {
          e.preventDefault();

          return false;
        }
      }}
      {...props}
    />
  );
};
