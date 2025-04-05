'use client';

import { ControlPosition, Map } from '@vis.gl/react-google-maps';
import React, { useState } from 'react';

import AutoCompleteControl from './auto-complete-control';
import AutocompleteResult from './autocomplete-result';

export type AutocompleteMode = { id: string; label: string };

const implementations: Array<AutocompleteMode> = [
  { id: 'custom', label: 'Minimal Custom Build' },
  { id: 'custom-hybrid', label: 'Custom w/ UI Library' },
  { id: 'webcomponent', label: '<gmp-place-autocomplete> component (beta)' }
];

export const GoogleMap = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null);

  // const incompatibleVersionLoaded = Boolean(
  //   globalThis &&
  //     globalThis.google?.maps?.version &&
  //     !(
  //       globalThis.google?.maps?.version.endsWith('-alpha') ||
  //       globalThis.google?.maps?.version.endsWith('-beta')
  //     )
  // );

  // if (incompatibleVersionLoaded) {
  //   location.reload();

  //   return;
  // }

  return (
    <>
      <Map
        mapId={'97RTJNyct0b-w6ZVgrP0u6e1FwMMiUGIa98ae_3-GZE'}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="h-full max-h-83 [&>div]:rounded-2xl"
        // style={{ borderRadius: '16px' }}
      >
        <AutoCompleteControl
          controlPosition={ControlPosition.TOP_LEFT}
          selectedImplementation={implementations[0]}
          onPlaceSelect={setSelectedPlace}
        />

        <AutocompleteResult place={selectedPlace} />
      </Map>

      {/* <ControlPanel
        implementations={implementations}
        selectedImplementation={selectedImplementation}
        onImplementationChange={setSelectedImplementation}
      /> */}
    </>
  );
};
