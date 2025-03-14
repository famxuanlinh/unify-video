export * from './auth';
export * from './base64';
export * from './constants';
export * from './helpers';
export * from './modal.utils';
export * from './local-storage.utils';
export * from './browser.utils';
export * from './embedded.utils';
export * from './storage-access.utils';
export * from './community.utils';

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
