import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import moment from 'moment'
import axios from 'axios';

// Import the Auth0 configuration
import { domain, clientId, audience } from "../auth_config.json";

// Import the plugin here
import { Auth0Plugin } from "@/auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
  }
});

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$http = axios

Vue.prototype.$formatDecimal = e => {

  if (!e) return ''

  // split the number by decimal
  let parts = e.toString().split("."),
      // define parts left of the decimal
      left = parts[0],
      // define parts right of the decimal
      right = parts[1],
      // reverse the numbers left of the decimal
      chunks = left.split("").reverse(),
      // instantiate a new array
      arr = [],
      // define the amount of digits to iterate
      len = chunks.length;

  // iterate the chunks from tail to head
  for (let i = len - 1; i >=0; i--) {
    // add each chunk to the new array
    arr.push(chunks[i])
    // if i mod 3, insert a comma into the array
    if (i > 0 && i % 3 === 0) {
      arr.push(",")
    }
  }

  // join the new array, good job
  left = arr.join("")

  // if there's nothing to the right of decimals, return the left
  if (!right) {
    return left
  }

  // strip the right of any zeros
  right = right.replace(/0*$/g, '')

  // if it was all zeros, return the newly comma'd left hand values
  if (!right) {
    return left
  }

  // rejoin left and right values; return the goodness
  return left + "." + right
}

Vue.prototype.$formatPrice = e => {
  if (!e) return ''
  return '$' + Vue.prototype.$formatDecimal(e)
}

Vue.prototype.$formatFbPrice = e => {
  if (!e) return ''
  let l = e.toString().slice(0, -2);
  let r = e.toString().slice(-2);
  return '$' + Vue.prototype.$formatDecimal(l + '.' + r)
}


Vue.prototype.$debug = e => {
  console.log(e)
  let result = JSON.stringify(e, null, 1)
  if (result !== '{}') {
    console.log(result)
    return result
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
