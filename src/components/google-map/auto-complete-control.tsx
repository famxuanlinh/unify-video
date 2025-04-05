'use client';

import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import React from 'react';

import { AutocompleteCustom } from './autocomplete-custom';
import { AutocompleteCustomHybrid } from './autocomplete-custom-hybrid';
import { AutocompleteWebComponent } from './autocomplete-webcomponent';
import { AutocompleteMode } from './google-map';

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  selectedImplementation: AutocompleteMode;
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
};

const AutocompleteControl = ({
  controlPosition,
  selectedImplementation,
  onPlaceSelect
}: CustomAutocompleteControlProps) => {
  const { id } = selectedImplementation;

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        {id === 'custom' && (
          <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'custom-hybrid' && (
          <AutocompleteCustomHybrid onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'webcomponent' && (
          <AutocompleteWebComponent onPlaceSelect={onPlaceSelect} />
        )}
        <AutocompleteWebComponent onPlaceSelect={onPlaceSelect} />
      </div>
    </MapControl>
  );
};

export default React.memo(AutocompleteControl);
