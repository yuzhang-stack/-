import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
const LogOut = {
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOGOUT')
      // localStorage.removeItem("userInfo")
      // resolve()
    })
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      console.log('username=',username)
      console.log('password=',password)
      // 登录
      login( username, password ).then(response => {
        const { data } = response
        console.log('data=',data)
        console.log('token=',data.token)
        console.log('userName=',data.userName)
        sessionStorage.setItem("username", data.userName);
        // 写死
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userName)
        // commit('SET_INTRODUCTION', '123')
        // commit('SET_NAME', 'admin')
        // commit('SET_AVATAR', 'http://yifang.insightin.cn/program_img/025e3e484e25f00318cc84bae3ed90f.png')
        // commit('SET_ROLES', '1')

        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
        console.log('error=',error)

      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = {
        roles:['admin'],
        introduction:'我是',
        // name:'zhang1',
        avatar:'http://yifang.insightin.cn/program_img/025e3e484e25f00318cc84bae3ed90f.png',
      }
        if (!data) {
          reject('验证失败')
        }
      commit('SET_INTRODUCTION', data.introduction)
      // commit('SET_NAME', data.name)
      commit('SET_AVATAR', data.avatar)
      commit('SET_ROLES', data.roles)
      // getInfo(state.token).then(response => {
      //   const { data } = response
      //
      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }
      //
      //   const { roles, name, avatar, introduction } = data
      //
      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }
      //
      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
        resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // // user logout
  // logout({ commit, state, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_ROLES', [])
  //       removeToken()
  //       resetRouter()
  //
  //       // reset visited views and cached views
  //       // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
  //       dispatch('tagsView/delAllViews', null, { root: true })
  //
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },
  // 登出

}

export default {
  namespaced: true,
  state,
  LogOut,
  mutations,
  actions
}
