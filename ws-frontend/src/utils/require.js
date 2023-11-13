exports.ajax = (url, option) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (option.headers) {
      option.headers = {
        ...option.headers,
        ...headers
      }
    } else {
      option.headers = headers
    }
    fetch(url, option)
      .then(data => {
        return data.json()
      })
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}
