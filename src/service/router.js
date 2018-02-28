import Vue from 'vue'
import Router from 'vue-router'
import config from  'service/config';
import Layout from 'components/Layout/index.vue'
import {localStore, sessionStore} from  'service/store';

Vue.use(Router);


export const routerMap = [
    /*{
     path: '*',
     component: Layout,
     redirect: '/home',
     name: '首页',
     hidden: true, // 在侧边栏中不显示该菜单
     children: [{
     path: 'home',
     component: resolve => {
     require(['../views/home/index.vue'], resolve)
     }
     }]
     },*/
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      name: '首页',
      hidden: true, // 在侧边栏中不显示该菜单
      children: [{
        path: 'home',
        component: resolve => {
          require(['../views/home/index.vue'], resolve)
        }
      }]
    },
    {
      path: '/login',
      hidden: true,
      component: resolve => {
        require(['../views/login/index.vue'], resolve)
      }
    },
    {
      path: '/store',
      component: Layout,
      redirect: '/store/picture',
      name: '我的门店',
      icon: 'home',
      auth: [1, 3],
      children: [
        {
          path: 'info',
          name: '基本信息',
          component: resolve => {
            require(['../views/store/info.vue'], resolve)
          }
        },
        {
          path: 'decorate',
          name: '门店装饰',
          component: resolve => {
            require(['../views/store/decorate.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/picture',
      component: Layout,
      redirect: '/picture/index',
      name: '图库管理',
      icon: 'tshirt',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/picture/index.vue'], resolve)
          },
          name: '图库列表'
        }
      ]
    },
    {
      path: '/new',
      component: Layout,
      redirect: '/new/index',
      name: '时尚资讯',
      icon: 'tshirt',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/new/index.vue'], resolve)
          },
          name: 'Tailorx'
        },
        {
          path: 'detail',
          component: resolve => {
            require(['../views/new/detail.vue'], resolve)
          },
          name: '资讯详情'
        }
      ]
    },
    {
      path: '/designer',
      component: Layout,
      redirect: '/designer/index',
      name: '设计师管理',
      icon: 'document-text',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/designer/index.vue'], resolve)
          },
          name: '设计师列表'
        },
        {
          path:'detail',
          name:'设计师详情',
          component:resolve => {
            require(['../views/designer/detail.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/order',
      component: Layout,
      name: '订单管理',
      icon: 'document-text',
      redirect: '/order/customer',
      children: [ // 订单管理
        {
          path: 'customer',
          name: '客户订单',
          redirect: '/order/customer',
          component: resolve => {
            require(['../views/order/customer/view.vue'], resolve)
          },
          children: [ // 客户订单
            {
              path: '/',
              component: resolve => {
                require(['../views/order/customer/index.vue'], resolve)
              }
            },
            {
              path: 'detail',
              name: '客单详情',
              redirect: '/order/customer/detail',
              component: resolve => {
                require(['../views/order/customer/view.vue'], resolve)
              },
              children: [ // 客单详情
                {
                  path: '/',
                  meta: {needParam: true},
                  component: resolve => {
                    require(['../views/order/customer/detail.vue'], resolve)
                  }
                },
                {
                  path: 'edit',
                  name: '工艺单',
                  meta: {needParam: true},
                  component: resolve => {
                    require(['../views/order/customer/edit.vue'], resolve)
                  }
                },
                /*{
                 path: 'technics',
                 name: '工艺单',
                 meta: {needParam: true},
                 component: resolve => {
                 require(['../views/order/customer/technics.vue'], resolve)
                 }
                 },
                 {
                 path: 'measure',
                 name: '客户量体数据',
                 meta: {needParam: true},
                 component: resolve => {
                 require(['../views/order/customer/measure.vue'], resolve)
                 }
                 }*/
              ]
            }
          ]
        },
        {
          path: 'sample',
          name: '样衣订单',
          redirect: '/order/sample',
          component: resolve => {
            require(['../views/order/sample/view.vue'], resolve)
          },
          children: [
            {
              path: '/',
              component: resolve => {
                require(['../views/order/sample/index.vue'], resolve)
              }
            },
            {
              path: 'detail',
              name: '样衣订详情',
              redirect: '/order/sample/detail',
              component: resolve => {
                require(['../views/order/sample/view.vue'], resolve)
              },
              children: [ // 详情
                {
                  path: '/',
                  meta: {needParam: true},
                  component: resolve => {
                    require(['../views/order/sample/detail.vue'], resolve)
                  }
                },
                {
                  path: 'edit',
                  name: '样衣单',
                  // meta: {needParam: true},
                  component: resolve => {
                    require(['../views/order/sample/edit.vue'], resolve)
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/material',
      component: Layout,
      icon: 'social-snapchat',
      name: '面辅料管理',
      redirect: '/material/price',
      children: [
        {
          path: 'price',
          name: '定价管理',
          component: resolve => {
            require(['../views/material/price/index.vue'], resolve)
          }
        },
        {
          path: 'inventory',
          name: '库存查询',
          redirect: '/material/inventory',
          component: resolve => {
            require(['../views/material/inventory/view.vue'], resolve)
          },
          children: [
            {
              path: '/',
              component: resolve => {
                require(['../views/material/inventory/index.vue'], resolve)
              }
            },
            {
              path: 'detail',
              name: '库存详情',
              meta: {needParam: true},
              component: resolve => {
                require(['../views/material/inventory/detail.vue'], resolve)
              }
            }
          ]
        }
      ]
    },
    {
      path: '/works',
      component: Layout,
      redirect: '/works/index',
      name: '作品管理',
      icon: 'document-text',
      noDropdown: true,
      children: [
        {
          path: 'index',
          name: '作品列表',
          component: resolve => {
            require(['../views/works/index.vue'], resolve)
          }
        },
        {
          path: 'edit',
          name: '编辑版库',
          component: resolve => {
            require(['../views/works/edit.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/templet',
      component: Layout,
      redirect: '/templet/index',
      name: '版库管理',
      icon: 'document-text',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/templet/index.vue'], resolve)
          },
          name: '版库列表'
        },
        {
          path: 'edit',
          component: resolve => {
            require(['../views/templet/edit.vue'], resolve)
          },
          name: '版库修改'
        }
      ]
    },
    {
      path: '/queue',
      component: Layout,
      redirect: '/queue/index',
      name: '排号管理',
      icon: 'document-text',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/queue/index.vue'], resolve)
          },
          name: '排号列表'
        }
      ]
    },
    {
      path: '/arrange',
      component: Layout,
      redirect: '/arrange/index',
      name: '排班管理',
      icon: 'document-text',
      noDropdown: true,
      children: [
        {
          path: 'index',
          component: resolve => {
            require(['../views/arrange/index.vue'], resolve)
          },
          name: '排班列表'
        }
      ]
    }
  ]
;


let router = new Router({
  routes: routerMap
});
router.beforeResolve((to, from, next) => {
  let ts = localStore.get('ticket')
    , cacheParam = sessionStore.get('cache_router_param') || []
    , cp = _.findWhere(cacheParam, {path: to.path}) // 从缓存中获取对应路由参数
    , version;


  if (to.path !== '/login' || from.path === '/login') {
    version = localStore.get('version');

    if (version !== config.VERSION) { // 版本控制
      return next({path: '/login'});
    } else if (_.isEmpty(ts)) { // 登录验证
      return next({path: '/login'});
    }
  }


  // 判断路由是否必须带入参数 todo 跳转之前页面地址没有带上参数
  if (to.meta.needParam) {
    if (_.isEmpty(to.params) && _.isEmpty(to.query)) {
      if (!_.isEmpty(cp)) {
        _.map(cp.query, (val, key) => {
          to.query[key] = val;
        });

        _.map(cp.params, (val, key) => {
          to.params[key] = val;
        });
      } else {
        return to.matched.length ? next({path: to.matched[1] ? to.matched[1].redirect : to.matched[0].redirect}) : next({path: '/'});
      }
    }
    if (!_.isEmpty(cp)) {
      cacheParam = _.filter(cacheParam, val => {
        return val.path !== to.path;
      });
    }

    cacheParam.push(_.pick(to, 'path', 'params', 'query'));
    sessionStore.set('cache_router_param', cacheParam);

  }

  next();
});

export default router
