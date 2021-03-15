import request from '@/utils/request'

export function login(userIdentifier,userPassword) {
  return request({
    url: '/web/v1.0/login/user-login',
    method: 'get',
    params: { userIdentifier, userPassword}
  })
}

export function getInfo(token) {
  return request({
    url: '/web/v1.0/login/user-login',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

