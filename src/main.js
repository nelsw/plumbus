import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import moment from 'moment'
import moment_tz from 'moment-timezone'
import axios from 'axios';

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$moment_tz = moment_tz
Vue.prototype.$http = axios

Vue.prototype.$debug = e => {
  console.log(e)
  let result = JSON.stringify(e, null, 1)
  if (result !== '{}') {
    console.log(result)
    return result
  }
}

Vue.prototype.$api = d => {
  return `https://bj9x2qbryf.execute-api.us-east-1.amazonaws.com/dev/${d}`
}

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
