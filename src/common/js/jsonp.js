import originJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}

function params (data) {
  let url = ''
  for (var k in data) {
    url += `&${k}=${encodeURIComponent(data[k])}`
  }
  return url.substring(1)
}
// console.log(params({'xu': 'sdf','sd': 'sd sw d'}))
