import Vue from 'vue'
import App from './App'

// Vue.config.productionTip = false

//工具类
import utils from './pages/utils/utils.js'
Vue.prototype.$utils = utils
import api from './pages/page/api/index.js'
Vue.prototype.$api = api

//全局设定api
import * as page from '@/pages/page/api'
Vue.prototype.$page = page.default

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()