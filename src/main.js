import Vue from 'vue'
import App from './App.vue'
import router from './router'
// axios
import './axios/index'
import store from './store'
import mixins from './utils/mixin'

// 导入图片懒加载依赖包
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: import('./assets/images/error.svg'), //加载失败显示的图片
  loading: require('./assets/images/loadding.svg'), // 加载中显示的图片
  attempt: 3, 
  // listenEvents: [ 'scroll' ]
})



// 导入Aplayer
import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
  defaultCover: './assets/images/cat.jpg',
  productionTip: true,
});

// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)

// 导入进度条样式
import 'nprogress/nprogress.css'

// 导入全局初始化样式
import './assets/css/index.css'

// 全局混入
Vue.mixin(mixins)

Vue.config.productionTip = false
Vue.prototype.$Bus = new Vue()

new Vue({
  render: h => h(App),
  store,
  // 挂载到Vue示例上
  router
}).$mount('#app')
