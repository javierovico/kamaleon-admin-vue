import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import punto from "@/store/modules/punto";
import tour from '@/store/modules/tour'
import general from "@/store/modules/general";
import archivo from "@/store/modules/archivo";
import pano from "@/store/modules/pano";
import tourSpot from "@/store/modules/tourSpot";
import visor from "@/store/modules/visor";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    user,
    auth,
    punto,
    tour,
    general,
    archivo,
    pano,
    tourSpot,
    visor,
  },
  strict: debug
});
