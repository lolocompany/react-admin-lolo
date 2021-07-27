const customlocalStorage = {
  setItem: (key, value) => {
    let event = new Event('localStorageItemUpdated');
    event.key = key;
    event.value = value;
    localStorage.setItem(key, value);
    window.dispatchEvent(event);
  },
  removeItem: key => {
    let event = new Event('localStorageItemUpdated');
    localStorage.removeItem(key);
    window.dispatchEvent(event);
  },
  getItem: key => {
    return localStorage.getItem(key);
  },
};

export default customlocalStorage;
