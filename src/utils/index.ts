import { env } from '@/constants';

export * from './auth';
export * from './base64';
export * from './helpers';
export * from './ipfs.utils';
export * from './image-compression';

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

export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s-_])/g, '')
    .replace(/(\s+)/g, '_')
    .replace(/_+/g, '_')
    .replace(/^-+|-+$/g, '');
};

export function getImageUrl(hash?: string | null) {
  if (!hash) return undefined;

  return env.IPFS_BASE_URL + hash;
}
