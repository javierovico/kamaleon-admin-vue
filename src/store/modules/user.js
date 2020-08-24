import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import Vue from "vue";
import axios from "axios";
import {AUTH_LOGOUT} from "@/store/actions/auth";

const state = { status: "", profile: {} };

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name,
  isAdmin: (state) => {
    // return state.profile.rols;
    let ret = false;
    if(state.profile.rols) {
      state.profile.rols.forEach(function (e) {
        if (e.name === 'admin') {
          ret = true;
        }
      })
    }
    return ret;
  }
};

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }) => {
    commit(USER_REQUEST);
    axios({url: '/auth/user'})
      .then(resp => {
        commit(USER_SUCCESS, resp.data);
      })
      .catch(() => {
        commit(USER_ERROR);
        dispatch(AUTH_LOGOUT);
      })
  }
};

const mutations = {
  [USER_REQUEST]: state => {
    state.status = "loading";
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = "success";
    // console.log(resp)
    state.profile = resp
    Vue.set(state, "profile", resp);
  },
  [USER_ERROR]: state => {
    state.status = "error";
  },
  [AUTH_LOGOUT]: state => {
    state.profile = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
