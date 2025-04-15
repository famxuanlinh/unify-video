import { env } from '@/constants';

export * from './auth';
export * from './base64';
export * from './helpers';
export * from './ipfs.utils';
export * from './image-compression';
export * from './get-distance';

export function b64EncodeUnicode(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

// Decoding base64 ⇢ UTF-8
export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export function getImageUrl(hash?: string | null) {
  if (!hash) return undefined;

  return env.IPFS_BASE_URL + hash;
}
