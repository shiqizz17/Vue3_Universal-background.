import { createApp } from 'vue'
import './assets/less/index.less'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/api'
import './api/mock'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$api = api

store.commit('addMenu', router)

router.beforeEach((to, from, next) => {
  store.commit('getToken')
  const token = store.state.token
  if(!token && to.name !== 'login') {
    next({name:'login'})
  } else {
    next()
  }
})

app.use(router).use(store)

// 清空控制台的提示信息
app.config.warnHandler = () => null

app.mount('#app')
