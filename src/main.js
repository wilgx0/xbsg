import 'amfe-flexible';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store'
import Http from '@/services/http.js'
import util from '@/util.js'

import { NoticeBar,Button,Icon,NavBar,PullRefresh,
    List,Cell,CellGroup,Toast,Popup,Field,Row,Col,Lazyload } from 'vant'

Vue.use(NoticeBar).use(Button).use(Icon).use(NavBar).use(PullRefresh).use(List).use(Cell).use(CellGroup).use(Toast)
    .use(Popup).use(Field).use(Row).use(Col).use(Lazyload)

//全局方法
Vue.prototype.$http = Http

//全局过滤方法
Vue.filter('splitStr', util.splitStr)

Vue.config.productionTip = false


new Vue({
  router,
  //store,
  render: h => h(App)
}).$mount('#app')
