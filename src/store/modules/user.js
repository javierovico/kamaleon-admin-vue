import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import Vue from "vue";
import axios from "axios";
import {AUTH_LOGOUT} from "@/store/actions/auth";

const state = {
    status: "",
    profile: {},
    menus:[],
};

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name,
    userName: state => state.profile.username,
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
    },
    getMenus: state => state.menus,
    checkPermiso: state => codigo => true,  //estatico nomas, proximamente TODO
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }) => {
        commit(USER_REQUEST);
        axios({url: '/auth/user'})
            .then(resp => {
                commit(USER_SUCCESS, resp.data);
                commit('cargar_menu')
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
    },
    cargar_menu: (state) => {
        state.menus = [
            {
                nombre: 'Lugares',
                link:null,
                permiso:null,
                nivel:null,
                tipo: 'dropdown',
                hijos: [
                    {
                        nombre:'Hoteles',
                        link:'/puntos',
                        permiso:'empresa_listar',
                        nivel:'general',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
                    },
                    {
                        nombre:'Tours',
                        link:'/tours',
                        permiso:'empresa_listar',
                        nivel:'general',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
                    },
                ]
            },
            {
                nombre: 'Panoramas',
                link:null,
                permiso:null,
                nivel:null,
                tipo: 'dropdown',
                hijos: [
                    {
                        nombre:'Panoramas',
                        link:'/panoramas',
                        permiso:'empresa_listar',
                        nivel:'general',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
                    },
                ]
            },
        ]
        // .map(mt=>{
        //     switch (mt.tipo) {
        //         case 'dropdown':
        //             mt.hijos = mt.hijos.filter(mh => comprobarMenu(mh, state, getters))
        //             break;
        //     }
        //     return mt
        // })
        // .filter(mt=> {
        //     switch(mt.tipo){
        //         case 'dropdown':
        //             return mt.hijos.length > 0;
        //         case 'simple':
        //             return comprobarMenu(mt,state,getters)
        //         default:
        //             return false
        //     }
        // })
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
