export class Browser {
  public static async detectChromiumBrowser() {
    try {
      const userAgent = navigator.userAgent;
      const vendor = navigator.vendor;

      if (!userAgent || !vendor) {
        throw new Error('User agent or vendor information is unavailable.');
      }

      const isChromium = /Chrome/.test(userAgent) && /Google Inc/.test(vendor);

      if (isChromium) {
        if (/Edg\//.test(userAgent)) {
          return 'Microsoft Edge (Chromium)';
        } else if (/OPR\//.test(userAgent)) {
          return 'Opera';
        } else if (/CocCocBrowser/.test(userAgent)) {
          return 'Cốc Cốc';
        } else if (
          (navigator as any)?.brave &&
          (await (navigator as any)?.brave?.isBrave())
        ) {
          return 'Brave';
        } else {
          return 'Google Chrome';
        }
      }

      return 'Not a Chromium-based browser';
    } catch (error) {
      console.error('An error occurred while detecting the browser:', error);
      return null;
    }
  }
}
