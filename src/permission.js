import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar进度条
import 'nprogress/nprogress.css' // progress bar style进度条样式
import {getToken} from '@/utils/auth' // get token from cookie从cookie中获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress ConfigurationNProgress配置

// 白名单，在白名单当中的路由可以免登录，直接进入。
//比较常见的使用场景是进入登陆界面或者是进入扫码下载界面
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist没有重定向白名单


router.beforeEach(async (to, from, next) => {
  // start progress bar开始进度条
  NProgress.start()

  // set page title设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 确认用户是否已登录
  const hasToken = getToken()
  console.log('hasToken=', hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，则重定向到主页
      //这种场景不是应用于退出登录的，一般是用于因为有人在路径当中直接输入/login来进行路由跳转，
      //然后就会重定向回首页
      next({path: '/'})
      NProgress.done() //加载结束
    } else {
      // next({...to, replace: true})
      // const replace = true;
      // next(to.path, replace)
      // // NProgress.done()
      // console.log('to.path=', to.path)
      // NProgress.done() //加载结束

      // return false

      // 否则路由要跳转到其他界面，比如首
      // determine whether the user has obtained his permission roles through getInfo
      // 通过getInfo判断用户是否获得了权限角色

      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { // 如果拿取到了用户的名字信息就直接让它跳转到下一个路由
        next()// 跳转到下一个路由
      } else {
        try {
          // get user info获取用户信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const {roles} = await store.dispatch('user/getInfo')//  触发vux仓库的获取用户信息的事件，获取用户信息
          console.log('roles=', roles)

          // generate accessible routes map based on roles
          // 根据角色生成可访问路由图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // 黑客方法，以确保地址路由是完整的
          // set the replace: true, so the navigation will not leave a history record
          // 设置replace: true，这样导航就不会留下历史记录
          next({...to, replace: true})
        } catch (error) {
          // remove token and go to login page to re-login
          // 删除令牌，然后转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 没有令牌
    // 巨坑
    // next()
    // console.log('${to.path}=',to.path)
    // //
    // NProgress.done()
    // return  false
    // console.log('11')

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 在免费登录白名单中，直接进入
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }



  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page 如果已登录，则重定向到主页
  //     //这种场景不是应用于退出登录的，一般是用于因为有人在路径当中直接输入/login来进行路由跳转，
  //     //然后就会重定向回首页
  //     next({path: '/'})
  //     NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  //   } else {
  //     // 否则路由要跳转到其他界面，比如首页
  //
  //     // determine whether the user has obtained his permission roles through getInfo
  //     // 通过getInfo判断用户是否获得了权限角色
  //
  //     const hasRoles = store.getters.roles && store.getters.roles.length > 0
  //     if (hasRoles) { // 如果拿取到了用户的名字信息就直接让它跳转到下一个路由
  //       next()// 跳转到下一个路由
  //     } else {
  //       try {
  //         // get user info获取用户信息
  //         // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
  //         // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
  //         const {roles} = await store.dispatch('user/getInfo')//  触发vux仓库的获取用户信息的事件，获取用户信息
  //
  //         // generate accessible routes map based on roles
  //         // 根据角色生成可访问路由图
  //         const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
  //
  //         // dynamically add accessible routes
  //         // 动态添加可访问路由
  //         router.addRoutes(accessRoutes)
  //
  //         // hack method to ensure that addRoutes is complete
  //         // 黑客方法，以确保地址路由是完整的
  //         // set the replace: true, so the navigation will not leave a history record
  //         // 设置replace: true，这样导航就不会留下历史记录
  //         next({...to, replace: true})
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         // 删除令牌，然后转到登录页面重新登录
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   // 没有令牌
  //
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     // 在免费登录白名单中，直接进入
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  // 完成进度条
  NProgress.done()
})
