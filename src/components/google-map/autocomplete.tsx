'use client';

import { useAutocompleteSuggestions } from '@/hooks';
import { Location } from '@/types';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import debounce from 'lodash/debounce';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';

import { Input } from '@/components';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  onGetLocation: (values: Location) => void;
}

export interface AutocompleteCustomRef {
  setPlaceByLatLng: (lat: number, lng: number) => void;
}

export const Autocomplete = React.forwardRef<AutocompleteCustomRef, Props>(
  ({ onPlaceSelect, onGetLocation }, ref) => {
    const places = useMapsLibrary('places');
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const { suggestions, resetSession, isLoading } =
      useAutocompleteSuggestions(searchDebounce);
    const containerRef = useRef<HTMLDivElement>(null);

    const setPlaceByLatLng = useCallback(
      async (lat: number, lng: number) => {
        const location = new google.maps.LatLng(lat, lng);

        const geocoder = new google.maps.Geocoder();
        const results = await geocoder.geocode({ location });

        if (results && results.results.length > 0) {
          const result = results.results[0];

          // simulate the place object
          const place: google.maps.places.Place = {
            formattedAddress: result.formatted_address,
            location: result.geometry.location,
            viewport: result.geometry.viewport
          } as google.maps.places.Place;

          onGetLocation({
            lat: lat,
            long: lng,
            name: result.formatted_address
          });

          setInputValue(result.formatted_address || '');
          onPlaceSelect(place);
        }
      },
      [places, onPlaceSelect]
    );

    useImperativeHandle(ref, () => ({
      setPlaceByLatLng
    }));

    const debounceSearch = useMemo(
      () =>
        debounce(event => {
          setSearchDebounce((event.target as HTMLInputElement).value);
        }, 500),
      []
    );

    const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
      debounceSearch(event);
      setInputValue((event.target as HTMLInputElement).value);
    };

    const handleSuggestionClick = useCallback(
      async (suggestion: google.maps.places.AutocompleteSuggestion) => {
        if (!places) return;
        if (!suggestion.placePrediction) return;
        setInputValue(suggestion.placePrediction?.text.text);
        setOpen(false);

        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['viewport', 'location']
        });

        resetSession();
        if (place.location) {
          onGetLocation({
            lat: place.location?.lat(),
            long: place.location?.lng(),
            name: suggestion.placePrediction?.text.text
          });
          onPlaceSelect(place);
        }
      },
      [places, onPlaceSelect]
    );

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

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div ref={containerRef}>
        <div className="relative">
          <Input
            onClick={() => setOpen(true)}
            placeholder="Type location"
            type="text"
            value={inputValue}
            onInput={handleSearch}
          />
          <div className="bg-white-200 absolute top-4 right-3">
            {isLoading ? (
              <LoaderCircle className="text-dark-grey size-4 animate-spin" />
            ) : (
              <ChevronDown className="text-dark-grey size-4" />
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
  }
);
Autocomplete.displayName = 'AutocompleteCustom';
