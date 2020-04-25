import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
//全局注册带树状网格的VUE桌子
import TreeTable from 'vue-table-with-tree-grid'
//全局注册富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
//引入进度条样式
import 'nprogress/nprogress.css'


Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor);


//定义全局过滤日期格式转换
Vue.filter('dateFormat', function(time){
  const dt = new Date(time * 1000);
  //转换年月日
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  //转换时间
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
