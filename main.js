import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import store from './store/index.js'


Vue.prototype.$store = store
Vue.config.productionTip = false
Vue.component('cu-custom',cuCustom)
import { http } from './js_sdk/luch-request/index.js' // 全局挂载引入，配置相关在该index.js文件里修改
Vue.prototype.$http = http
// // 下拉加载
// import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
// 	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
// 	Vue.component('mescroll-body', MescrollBody)
// 	Vue.component('mescroll-uni', MescrollUni)


App.mpType = 'app'
import uView from 'uview-ui';
Vue.use(uView);
const app = new Vue({
    ...App
})
app.$mount()
