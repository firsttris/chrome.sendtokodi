import Vue from 'vue';
import VueRouter from 'vue-router';
import Play from "./../components/Play.vue"
import App from "./../components/App.vue"

Vue.use(VueRouter);

const routes = [
  {path: "*", component: Play}
];

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});