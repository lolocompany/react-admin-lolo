const event = new Event('localStorageItemUpdated')

const customlocalStorage = {
  setItem: (key, value) => {
    event.key = key
    event.value = value
    localStorage.setItem(key, value)
    window.dispatchEvent(event)
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
    window.dispatchEvent(event)
  },
  getItem: (key) => {
    return localStorage.getItem(key)
  }
}

export default customlocalStorage