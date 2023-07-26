/**
 * 环境配置文件
 * 一般在企业级项目里面有三个环境
 * 开发环境
 * 测试环境
 * 线上环境
 */

// 当前环境
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  // 线上环境
  development: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/d06886e1b4007c4cf9793e24aa215d5c/api',
  },
  // 测试环境
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://www.fastmock.site/mock/d06886e1b4007c4cf9793e24aa215d5c/api',
  },
  // 开发环境 
  pro: {
    baseApi: '//future.com/api',
    mockApi: 'https://www.fastmock.site/mock/d06886e1b4007c4cf9793e24aa215d5c/api',
  },
}

export default {
  env,
  // mock总开关
  mock: true,
  ...EnvConfig[env]
}