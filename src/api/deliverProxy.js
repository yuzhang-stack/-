import axios from 'axios'
import request from '@/utils/request'
import requestnew from '@/utils/requestNew'
import requestCode from '@/utils/requestCode'

import { getToken } from '@/utils/auth'
// function get(params) {
//   let data = params.data
//   let param = '?'
//   if (data) {
//     for (let key in data) {
//       if (data.hasOwnProperty(key)) {
//         param += `&${key}=${data[key]}`
//       }
//     }
//   }
//   return axios.get('/api' + params.url + param)
// }
// 用于注销登录
function getCode(url, data, isTest) {
  let p = '?'
  if (!data) {
    data = {}
  }
  if (data) {
    if (!data.token && getToken()) {
      // data.token = getToken()
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        p += `&${key}=${data[key]}`
      }
    }
  } else {
    p = ''
  }
  if (isTest) {
    console.log(url + p)
    return null
  }
  return requestCode.getCode(url + p)
}


function get(url, data, isTest) {
  let p = '?'
  if (!data) {
    data = {}
  }
  if (data) {
    if (!data.token && getToken()) {
      // data.token = getToken()
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        p += `&${key}=${data[key]}`
      }
    }
  } else {
    p = ''
  }
  if (isTest) {
    console.log(url + p)
    return null
  }
  return request.get(url + p)
}

// function post(url, data) {
//   if (!data) {
//     data = {}
//   }
//   if (!data.token && getToken()) {
//     // data.token = getToken()
//   }
//   return request.post(url, data)
// }

// application/json
function postn(url, data, body) {
  if (!body) {
    return requestnew.post(url, data)
  }
  return requestnew.post(url + genQuery(data), body)
}
// s删除
function fdelete (url, data, body) {
  if (!body) {
    return request.delete(url, data)
  }
  return request.fdelete(url + genQuery(data), body)
}
// 常规
function post(url, data, body) {
  if (!body) {
    return request.post(url, data)
  }
  return request.post(url + genQuery(data), body)
}

// 上传文件
function postfile(url, data, body) {
  if (!body) {
    return request.post(url, data)
  }
  return request.postfile(url + genQuery(data), body)
}


function genQuery(data) {
  let query = ''
  if (data) {
    query = '?'
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key])
          query += `&${key}=${data[key]}`
      }
    }
  }
  return query
}

export default { get, post, postn ,getCode,postfile,fdelete}
