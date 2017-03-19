import Vue from 'vue';
import VueRouter from 'vue-router';
import App from "./../components/App.vue"
import Settings from "./../components/Settings.vue"

Vue.use(VueRouter);

const routes = [
  {path: "*", component: Settings}
];

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});