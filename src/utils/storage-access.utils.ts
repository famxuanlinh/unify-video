import { Browser } from './browser.utils';
import { LocalStorage } from './local-storage.utils';

export class StorageAccess {
  public static async hasCookieAccess() {
    // Check if Storage Access API is supported
    if (!document.requestStorageAccess) {
      // Storage Access API is not supported so best we can do is
      // hope it's an older browser that doesn't block 3P cookies.
      return true;
    }

    // Check if access has already been granted
    if (await document.hasStorageAccess()) {
      console.log('Access already granted');
      return true;
    }

    // Check the storage-access permission
    // Wrap this in a try/catch for browsers that support the
    // Storage Access API but not this permission check
    // (e.g. Safari and earlier versions of Firefox).
    let permission;
    try {
      permission = await navigator.permissions.query({
        name: 'storage-access'
      } as any);
    } catch (error) {
      console.log(
        'storage-access permission not supported. Assume no cookie access.'
      );

      return false;
    }

    if (permission) {
      if (permission.state === 'granted') {
        // Permission has previously been granted so can just call
        // requestStorageAccess() without a user interaction and
        // it will resolve automatically.
        try {
          // await document.requestStorageAccess({ all: true });
          return true;
        } catch (error) {
          console.log(`This shouldn't really fail if access is granted, but return false
              // if it does.`);
          return false;
        }
      } else if (permission.state === 'prompt') {
        // Need to call requestStorageAccess() after a user interaction
        // (potentially with a prompt). Can't do anything further here,
        // so handle this in the click handler.
        return false;
      } else if (permission.state === 'denied') {
        // Not used: see https://github.com/privacycg/storage-access/issues/149
        return false;
      }
    }

    // By default return false, though should really be caught by earlier tests.
    return false;
  }

  public static async syncStorage() {
    try {
      const browser = await Browser.detectChromiumBrowser();
      let accessTypes = undefined;

      switch (browser) {
        case 'Brave':
          // Brave doesn't support accessTypes
          // It will throw an unhandled promise rejection if accessTypes is passed
          accessTypes = { localStorage: true };
          break;
        default:
          accessTypes = {
            localStorage: true,
            cookies: true
          };
          break;
      }

      const handle = await (document.requestStorageAccess as any)(accessTypes);

      const isLogined = handle?.localStorage?.JWT;

      if (isLogined) {
        LocalStorage.setAllLocalStorageItems(handle?.localStorage);
        return true;
      } else {
        console.error('No handle or localStorage');
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public static async init() {
    const hasAccess = await this.hasCookieAccess();
    if (hasAccess) {
      console.log('Access granted');
    } else {
      console.log('No access');
    }
  }
}
