export class LocalStorage {
  // Get all items in localStorage and return an object
  public static getAllLocalStorageItems() {
    const localStorageObject = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      localStorageObject[key] = value;
    }
    return localStorageObject;
  }

  // Set all properties of an object to localStorage
  public static setAllLocalStorageItems(dataObject) {
    for (const key in dataObject) {
      // eslint-disable-next-line no-prototype-builtins
      if (dataObject.hasOwnProperty(key)) {
        localStorage.setItem(key, dataObject[key]);
      }
    }
  }
}
