import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // 重置
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: '新注册用户',
  //       meta: { title: '新注册用户', icon: 'el-icon-user-solid', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [

  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu总是会显示根菜单吗
  //   name: 'Permission',
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'rolePermission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/academic',
    component: Layout,
    redirect: '/academic',
    name: 'academic',
    meta: {
      title: '学术管理',
      icon: 'el-icon-s-shop'
    },
    children: [
      {
        // path: 'edit/:id(\\d+)',
        path: '/Static',
        component: () => import('@/views/academic/Static'),
        name: '静态EDA管理',
        meta: { title: '静态EDA管理',  },
      },
      {
        // path: 'edit/:id(\\d+)',
        path: '/Dynamic',
        component: () => import('@/views/academic/Dynamic'),
        name: '动态EDA管理',
        meta: { title: '动态EDA管理',  },
      },
      {
        // path: 'edit/:id(\\d+)',
        path: '/academicMan',
        component: () => import('@/views/academic/academicMan'),
        name: '学术幻灯管理',
        meta: { title: '学术幻灯管理',  },
      },
      {
        // path: 'edit/:id(\\d+)',
        path: '/literature',
        component: () => import('@/views/academic/literature'),
        name: '文献管理',
        meta: { title: '文献管理',  },
      },
    ]
  },
  {
    path: '/meeting',
    component: Layout,
    redirect: '/meeting',
    name: 'meeting',
    meta: {
      title: '会议管理',
      icon: 'peoples'
    },
    children: [
      {
        // path: 'edit/:id(\\d+)',
        path: '/ThreeParties',
        component: () => import('@/views/meeting/ThreeParties'),
        name: '三方会管理',
        meta: { title: '三方会管理',},

      },
      // {
      //   path: '/SelfParties',
      //   component: () => import('@/views/meeting/SelfParties'),
      //   name: '自办会管理',
      //   meta: { title: '自办会管理', }
      // },
      // {
      //   path: '/prescribed',
      //   component: () => import('@/views/meeting/prescribed'),
      //   name: '处方量管理',
      //   meta: { title: '处方量管理', }
      // },
      {
        // path: 'edit/:id(\\d+)',
        path: '/live',
        component: () => import('@/views/meeting/live'),
        name: '直播管理',
        meta: { title: '直播管理',  },
      },
      {
        // path: 'edit/:id(\\d+)',
        path: '/video',
        component: () => import('@/views/meeting/video'),
        name: '回播管理',
        meta: { title: '回播管理',  },
      },
      {
        // path: 'edit/:id(\\d+)',
        path: '/wonderful',
        component: () => import('@/views/meeting/wonderful'),
        name: '精彩集锦',
        meta: { title: '精彩集锦',  },
      },
      {
        path: '/ToView',
        component: () => import('@/views/meeting/ToView'),
        name: '观看列表',
        meta: { title: '观看列表' },
        hidden:true,
      },

    ]
  },
  {
    path: '/management',
    component: Layout,
    redirect: '/management',
    name: 'management',
    meta: {
      title: '基础管理',
      icon: 'component'
    },
    children: [
      {
        // path: 'edit/:id(\\d+)',
        path: '/region',
        component: () => import('@/views/management/region'),
        name: '地区管理',
        meta: { title: '地区管理',},

      },


      {
        // path: 'edit/:id(\\d+)',
        path: '/hospital',
        component: () => import('@/views/management/hospital'),
        name: '医院管理',
        meta: { title: '医院管理',  },
      },
      {
        path: '/doctor',
        component: () => import('@/views/management/doctor'),
        name: '医生管理',
        meta: { title: '医生管理', }
      },
      // {
      //   // path: 'edit/:id(\\d+)',
      //   path: '/manual',
      //   component: () => import('@/views/management/manual'),
      //   name: '操作手册管理',
      //   meta: { title: '操作手册管理',  },
      // },
      // {
      //   path: 'dictionary',
      //   component: () => import('@/views/SystemSettings/dictionary'),
      //   name: '字典管理',
      //   meta: { title: '字典管理',}
      // }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/SystemSettings',
    component: Layout,
    redirect: '/SystemSettings',
    name: 'SystemSettings',
    meta: {
      title: '系统设置',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: '/user',
        component: () => import('@/views/SystemSettings/user'),
        name: '用户管理',
        meta: { title: '用户管理', }
      },
      {
        // path: 'edit/:id(\\d+)',
        path: 'role',
        component: () => import('@/views/SystemSettings/role'),
        name: '角色管理',
        meta: { title: '角色管理',  },

      },
      // {
      //   // path: 'edit/:id(\\d+)',
      //   path: 'role',
      //   component: () => import('@/views/SystemSettings/role'),
      //   name: '角色管理',
      //   meta: { title: '角色管理', noCache: true, activeMenu: '/example/role' },
      //   hidden: true
      // },
      {
        path: 'dictionary',
        component: () => import('@/views/SystemSettings/dictionary'),
        name: '字典管理',
        meta: { title: '字典管理',}
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules当你的路由图太长时，你可以把它分割成小模块 **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'mergeHeader' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'pdf', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
