import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import punto from "@/store/modules/punto";
import tour from '@/store/modules/tour'
import general from "@/store/modules/general";
import archivo from "@/store/modules/archivo";
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
  },
  strict: debug
});
