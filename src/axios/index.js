import Vue from 'vue'
import axios from 'axios'

// 导入 Nprogress 对应的JS和CSS
import NProgress from "nprogress"
// 改用 CDN方式
// import "nprogress/nprogress.css" 

// 接口地址
axios.defaults.baseURL = 'https://autumnfish.cn/'
// axios.defaults.baseURL = 'http://localhost:3000'

// 添加 请求头 和 进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // 添加 进度条
  NProgress.start()
  
  return config
})

axios.interceptors.response.use(config => {
  // 隐藏 进度条
  NProgress.done()

  return config
})

Vue.prototype.$axios = axios
