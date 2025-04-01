'use client';

import { FC, useEffect, useState } from 'react';

interface GoogleMapEmbedProps {
  coordinate: {
    lat?: number;
    long?: number;
  };
}

interface Address {
  road: string;
  quarter: string;
  suburb: string;
  city: string;
  postcode: string;
  country: string;
  country_code: string;
}

export const GoogleMapEmbed: FC<GoogleMapEmbedProps> = ({ coordinate }) => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>();
  useEffect(() => {
    setLoading(true);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate.lat}&lon=${coordinate.long}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAddress(data.address);
        setLoading(false);
      });
  }, [coordinate]);

  return (
    <div className="relative w-full">
      {loading && (
        <div className="absolute inset-0 h-6 animate-pulse rounded-2xl bg-gray-200"></div>
      )}

      <div className={`text-sm ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {address?.quarter}, {address?.suburb}, {address?.city},
        {address?.country}
      </div>
    </div>
  );
};
