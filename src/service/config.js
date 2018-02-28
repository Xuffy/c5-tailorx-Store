export default {
  // 环境配置
  ENV: {
    local: {
      // path: 'http://store1.test.tailorx.cn',
      path: '/static/__project',
      // api: 'http://192.168.11.215:30704'
      // api: 'http://192.168.51.10:30704'
      api: 'http://store.test.tailorx.cn/api'
    },
    develop: {
      // path: 'http://store.dev.tailorx.cn/static/__project',
      // api: 'http://store.dev.tailorx.cn/api'
      path: '/static/__project',
      api: 'http://192.168.11.215:30704'
    },
    test: {
      path: '/static/__project',
      api: 'http://store.test.tailorx.cn/api'
    },
    production: {
      path: '/static/__project',
      api: 'https://store.tailorx.cn/api'
    }
  }[process.env.NODE_ENV],

  // 请求超时
  TIMEOUT: 60000,

  // 项目版本号
  VERSION: `3.3.4.${process.env.VERSION}`,

  // 本地store缓存 前缀
  STORE_PREFIX: 'tailorx_store_'
}
