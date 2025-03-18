import { sanitizeUrl } from './community.utils';
import { ModalUtils } from './modal.utils';
import { StorageAccess } from './storage-access.utils';

enum StorageKeys {
  parentTabUrl = 'parentTabUrl',
  authRedirectKey = 'auth-redirect',
  embeddedToken = 'embeddedToken',
  isEmbeddedMobile = 'isEmbeddedMobile'
}

export class Embedded {
  public static init() {
    StorageAccess.init();
  }
  // Parent tab url is website url where the iframe is embedded
  public static getParentTabUrl(isStripScheme = false) {
    const parentUrl = localStorage.getItem(StorageKeys.parentTabUrl) ?? '';

    return isStripScheme ? parentUrl.replace(/(^\w+:|^)\/\//, '') : parentUrl;
  }

  //Get is Embedded Mobile
  public static getIsEmbeddedMobile() {
    if (typeof window !== 'undefined') {
      if (document.documentElement.getAttribute('data-rep-social')) return true;
    }

    return false;
  }

  public static setParentTabUrl(url: string) {
    localStorage.setItem(StorageKeys.parentTabUrl, url);
  }

  /**
   * Remove protocol (http:// or https://) and trailing slash (/) from a URL
   * @param url - The URL to be sanitized
   * @returns The sanitized URL
   */
  public static getParentCommunityUrlId() {
    return sanitizeUrl(this.getParentTabUrl());
  }

  public static isEmbeddedInIframe() {
    return (
      (typeof window !== 'undefined' && window.self !== window.top) ||
      (Embedded.getIsEmbeddedMobile() &&
        Embedded.getParentCommunityUrlId() &&
        typeof Embedded.getParentCommunityUrlId() === 'string')
    );
  }
}

const handleMessageFromParentWeb = (event: MessageEvent<any>) => {
  const parentUrl = event?.data?.parentUrl;
  if (parentUrl) {
    localStorage.setItem(StorageKeys.parentTabUrl, parentUrl);
    ModalUtils.sayModal?.closeOnQuotePost();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessageFromParentWeb);
}
