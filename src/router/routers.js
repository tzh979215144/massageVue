import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/massage',
    component: Layout,
    redirect: '/massage/massager',
    name: 'massage',
    meta: {
      title: 'All around',
      icon: 'validCode'
    },
    children: [
      {
        path: 'shopMassager',
        component: (resolve) => require(['@/views/massage/shopMassager'], resolve),
        name: 'shopMassager',
        meta: {
          title: '店铺员工分配',
          icon: 'Steve-Jobs'
        }
      },
      {
        path: 'giftVouchers',
        component: (resolve) => require(['@/views/massage/giftVouchers'], resolve),
        name: 'giftVouchers',
        meta: {
          title: 'Gift Vouchers',
          icon: 'timing'
        }
      },
      // {
      //   path: 'appointment',
      //   component: (resolve) => require(['@/views/massage/appointment'], resolve),
      //   name: 'appointment',
      //   meta: {
      //     title: '预约信息',
      //     icon: 'timing'
      //   }
      // },
      {
        path: 'record',
        component: (resolve) => require(['@/views/massage/record'], resolve),
        name: 'record',
        meta: {
          title: '按摩记录',
          icon: 'backup'
        }
      },
      {
        path: 'timeLine',
        component: (resolve) => require(['@/views/massage/timeLine'], resolve),
        name: 'timeLine',
        meta: {
          title: '员工时间线',
          icon: 'Steve-Jobs'
        }
      },
      {
        path: 'massager',
        component: (resolve) => require(['@/views/massage/massager'], resolve),
        name: 'massager',
        meta: {
          title: '按摩师信息',
          icon: 'people'
        }
      },
      {
        path: 'shop',
        component: (resolve) => require(['@/views/massage/shop'], resolve),
        name: 'shop',
        meta: {
          title: '店铺信息',
          icon: 'list'
        }
      },
      {
        path: 'guest',
        component: (resolve) => require(['@/views/massage/guest'], resolve),
        name: 'guest',
        meta: {
          title: '客人信息',
          icon: 'visits'
        }
      },

    ]
  }
]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
