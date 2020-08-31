import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/home";
import Account from "@/components/account";
import Login from "@/components/login";
import store from "../store";
import Puntos from "@/components/puntos/Puntos";
import Mapa from "@/components/Mapa/Mapa";
import MapaPrueba from "@/components/Mapa/MapaPrueba";

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
      path: "/puntos/:tourId?",
      name: "Puntos",
      component: Puntos,
      props: route=>({
        puntoCurrentPage: route.query.puntoCurrentPage?parseInt(route.query.puntoCurrentPage):1,
        puntoBuscar: route.query.buscar?route.query.buscar:null,
        puntoSortBy: route.query.puntoSortBy?route.query.puntoSortBy:null,
        puntoSortByDesc: route.query.puntoSortByDesc?parseInt(route.query.puntoSortByDesc)===1:false,
        tourId: route.params.tourId?parseInt(route.params.tourId):null,
      }),
      beforeEnter: ifAuthenticated
    },
    {
      path: "/mapa/:departamentoId?",
      name: "Mapa",
      component: Mapa,
      props: route=>({
        depCurrentPage: route.query.depCurrentPage?parseInt(route.query.depCurrentPage):1,
        ciuCurrentPage: route.query.ciuCurrentPage?parseInt(route.query.ciuCurrentPage):1,
        departamentoId: route.params.departamentoId?parseInt(route.params.departamentoId):null,
        ciudadId: null,
      }),
      beforeEnter: ifAuthenticated
    },
    {
      path: "/mapa/:departamentoId/ciudad/:ciudadId",
      name: "Mapa2",
      component: Mapa,
      props: route=>({
        depCurrentPage: route.query.depCurrentPage?parseInt(route.query.depCurrentPage):1,
        ciuCurrentPage: route.query.ciuCurrentPage?parseInt(route.query.ciuCurrentPage):1,
        departamentoId: route.params.departamentoId?parseInt(route.params.departamentoId):null,
        ciudadId: route.params.ciudadId?parseInt(route.params.ciudadId):null,
      }),
      beforeEnter: ifAuthenticated
    },
    {
      path: "/mapa-prueba",
      name: "MapaPrueba",
      component: MapaPrueba,
      beforeEnter: ifAuthenticated
    },
  ]
});
