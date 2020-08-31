import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Loading from "./components/lib/loading";
import CenterContainer from "./components/lib/center-container";
import router from "./router";
import VueFab from 'vue-float-action-button'
import * as VueGoogleMaps from "vue2-google-maps";
window.$ = window.jQuery = require('jquery')
import VueSimpleAlert from "vue-simple-alert";
// import $ from 'jquery'
import 'bootstrap-notify';
import {URL} from "@/Utils";
// import Krpano from "vue-krpano";
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
// Vue.use(Krpano);
Vue.use(VueFab, /* {
  ----------------------
  // opitons 可选iconfont图标或MaterialIcons
  iconType: 'MaterialDesign'
  // iconType: 'iconfont'
} */)
Vue.component("loading", Loading);
Vue.component("center-container", CenterContainer);
Vue.use(VueSimpleAlert);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyClbud6185Id2nosGO3ko4c9xRoE9t8snk",
    libraries: "places,geometry", // necessary for places input
  }
});
axios.defaults.baseURL = URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
}


new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')
