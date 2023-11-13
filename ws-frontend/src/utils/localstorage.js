/**
 * 设置LocalStorage
 */

/**
 * 允许的key值
 * @type {*[]}
 */
const localStorageKeys = [

]

const setLocalStorage = (key, value) => {
  if (localStorageKeys.includes(key)) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const getLocalStorage = (key) => {
  if (localStorageKeys.includes(key)) {
    let valueString = localStorage.getItem(key)
    return valueString ? JSON.parse(valueString) : valueString
  } else {
    return null
  }
}
export default {
  setLocalStorage,
  getLocalStorage
}
