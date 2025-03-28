'use client';

import React from 'react';

import { Button } from '@/components';

export function GetLocationButton({
  onGetLocation,
  coordinate
}: {
  onGetLocation: () => void;
  coordinate: { lat?: number; long?: number };
}) {
  //   useEffect(() => {
  //     navigator.geolocation.getCurrentPosition(pos => {
  //       const { latitude, longitude } = pos.coords;
  //       console.log(latitude, longitude);
  //       const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  //       fetch(url)
  //         .then(res => res.json())
  //         .then(data => setAdd(data.address));
  //     });
  //   }, []);

  return (
    <Button
      type="button"
      variant={'secondary'}
      size={'sm'}
      onClick={onGetLocation}
    >
      {!coordinate.lat ? 'Get location' : 'Update location'}
    </Button>
  );
}
