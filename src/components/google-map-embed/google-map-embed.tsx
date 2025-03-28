import { FC } from 'react';

interface GoogleMapEmbedProps {
  lat: number;
  lng: number;
}

export const GoogleMapEmbed: FC<GoogleMapEmbedProps> = ({ lat, lng }) => {
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15676.48579045583!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293ca1b0d7a5%3A0xd4f8b5decf20ca4!2sYour%20Location!5e0!3m2!1svi!2s!4v${Date.now()}!5m2!1svi!2s`;

  return (
    <>
      <iframe
        src={mapSrc}
        className="h-60 w-full rounded-2xl"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </>
  );
};
