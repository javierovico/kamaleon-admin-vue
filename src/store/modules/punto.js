import {PUNTO_CARGADO, PUNTO_CARGAR, PUNTO_ERROR} from "@/store/actions/punto";
import axios from "axios";
import Punto from "@/store/modelos/Punto";

const state = {
    status: "",
    puntos: []
};

const getters = {
    punto_puntos: state => state.puntos,
    punto_cargado: state => state.status === 'cargado',
    punto_cargando: state => state.status === 'cargando'
}

const actions = {
    punto_cargar({ commit, dispatch }, {params}) {
        return new Promise((resolve, reject) => {
            commit('punto_cargando');
            axios({url: Punto.URL_DESCARGA, params: params, method: 'GET' })
                .then(response => {
                    commit('punto_cargado', {response})
                    resolve({response})
                })
                .catch(err => {
                    commit('punto_error', err)
                    dispatch('general_error',err)
                    reject(err)
                })
        });
    },
};

const mutations = {
    punto_cargando: state => {
        state.status = "cargando";
    },
    punto_cargado: (state,{response}) =>{
        state.status = 'cargado'
        state.puntos = response.data.data.map(p=>Punto.fromSource(p))
    },
    punto_error: (state,error) => {
        state.status = "error";
        // state.puntos.splice(0,state.puntos.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
