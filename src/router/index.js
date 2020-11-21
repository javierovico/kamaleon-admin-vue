import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/home";
import Account from "@/components/account";
import Login from "@/components/login";
import store from "../store";
import Puntos from "@/components/puntos/Puntos";
import ProductoListView from "@/components/producto/ProductoListView";
import ProductoView from "@/components/producto/ProductoView";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export default new Router({
  mode: "history",
  // duplicateNavigationPolicy: 'reload',
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/account",
      name: "Account",
      component: Account,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: "/producto",
      name: "Productos",
      component: ProductoListView,
      props: route=>({
        page: route.query.page?parseInt(route.query.page):1,
        empresa_id: route.query.empresa_id?parseInt(route.query.empresa_id):null,
        propNombre:route.query.nombre?route.query.nombre:'',
      }),
      beforeEnter: ifAuthenticated
    },
    {
      path: "/producto/:articulo_id",
      name: "Productosf",
      component: ProductoView,
      props: route=>({
        empresa_id: route.query.empresa_id?parseInt(route.query.empresa_id):null,
        articulo_id: route.params.articulo_id?parseInt(route.params.articulo_id):null,
      }),
      beforeEnter: ifAuthenticated
    },
  ]
});
