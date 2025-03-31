'use client';

import { FC, useMemo, useState } from 'react';

interface GoogleMapEmbedProps {
  coordinate: {
    lat?: number;
    long?: number;
  };
}

export const GoogleMapEmbed: FC<GoogleMapEmbedProps> = ({ coordinate }) => {
  const [loading, setLoading] = useState(true);

  const embedUrl = useMemo(() => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15676.48579045583!2d${coordinate.long}!3d${coordinate.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293ca1b0d7a5%3A0xd4f8b5decf20ca4!2sYour%20Location!5e0!3m2!1svi!2s!5m2!1svi!2s`;
  }, [coordinate]);

  return (
    <div className="relative h-60 w-full">
      {loading && (
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-gray-200"></div>
      )}
      <iframe
        src={embedUrl}
        className={`h-60 w-full rounded-2xl transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};
