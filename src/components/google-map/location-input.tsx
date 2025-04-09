'use client';

import { useAutocompleteSuggestions } from '@/hooks';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import debounce from 'lodash/debounce';
import { ChevronDown, LoaderCircle, XIcon } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components';

interface Props {
  onSelectAddress: (value: string) => void;
  address?: string;
}

export interface AutocompleteCustomRef {
  setPlaceByLatLng: (lat: number, lng: number) => void;
}

export const LocationInput: React.FC<Props> = ({
  onSelectAddress,
  address
}) => {
  const places = useMapsLibrary('places');
  const [open, setOpen] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState('');
  const { suggestions, resetSession, isLoading } =
    useAutocompleteSuggestions(searchDebounce);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounceSearch = useMemo(
    () =>
      debounce(event => {
        setSearchDebounce((event.target as HTMLInputElement).value);
      }, 500),
    []
  );

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    debounceSearch(event);
    onSelectAddress((event.target as HTMLInputElement).value);
  };

  const handleSuggestionClick = (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!places) return;
    if (!suggestion.placePrediction) return;
    onSelectAddress(suggestion.placePrediction?.text.text);
    setOpen(false);
    resetSession();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef}>
      <label
        htmlFor="hometown"
        className="text-body-m text-light-grey gap-0 font-light"
      >
        Location
      </label>
      <div className="relative mt-3">
        <Input
          onClick={() => setOpen(true)}
          placeholder="Type location"
          type="text"
          className="line-clamp-1"
          value={address}
          onInput={handleSearch}
        />
        <div className="bg-white-200 absolute top-3 right-3">
          {isLoading ? (
            <LoaderCircle className="text-dark-grey animate-spin" />
          ) : (
            <>
              {address ? (
                <XIcon
                  onClick={() => {
                    onSelectAddress('');
                    setOpen(false);
                  }}
                  className="text-dark-grey"
                />
              ) : (
                <ChevronDown className="text-dark-grey" />
              )}
            </>
          )}
        </div>

        {suggestions.length > 0 && open && (
          <ul className="bg-white-200 relative z-10 mt-1 max-h-30 overflow-y-auto rounded-lg p-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-body-m line-clamp-1 cursor-pointer py-0.5"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.placePrediction?.text.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
