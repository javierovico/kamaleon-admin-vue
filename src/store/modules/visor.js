import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import TourSpot from "@/store/modelos/TourSpot";

const state = {
    statusVisor: {  //indica si ya fueron cargados
        tour: false,
        tourSpot: false,
        panos: false,
    },
    tourSpots: [],
    tour: null,
    panos: [],
    instancia: null,        //TODO: ver cuando restablecer
};

const getters = {
    visor_tourSpots: state => state.tourSpots,
    visor_tour: state => state.tour,
    visor_panos: state => state.panos,
    visor_cargado: state => (state.statusVisor.tourSpot && state. statusVisor.tour && state.statusVisor.panos),
    visor_titulo: (state,getters) => {
        if(!getters.visor_cargado){
            return `No Cargado`
        }else if(state.tour){
            return state.tour.nombre
        }else{
            return ``
        }
    },
    visor_instancia: state => state.instancia,
}

const actions = {
    visor_restablecer({commit,dispatch}){
        commit('visor_cargando')
    },
    visor_cargar_by_tour_id({ commit, dispatch }, {id,params}) {  //carga los parametros a parir del tourID
        dispatch('visor_restablecer')
        dispatch('tour_tour_by_id',{id,soloRetornar: true}).then(({tour})=>{
            commit('visor_tour_cargado',{tour})
        })
        dispatch('pano_cargar_by_tour_id',{id,params,soloRetornar:true}).then(({panos})=>{
            commit('visor_panos_cargado',{panos})
        })
        dispatch('tourSpot_cargar_by_tour_id',{id,params,soloRetornar:true}).then(({tourSpots})=>{
            commit('visor_tourSpot_cargado',{tourSpots})
        })
    },
    visor_cargar_by_pano_id({ commit, dispatch }, {id,params}) {  //carga los parametros a parir del panoId
        dispatch('visor_restablecer')
        commit('visor_tour_cargado',{tour:null})
        commit('visor_tourSpot_cargado',{tourSpots:[]})
        dispatch('pano_pano_by_id',{id,params,soloRetornar:true}).then(({pano})=>{
            commit('visor_panos_cargado',{panos:[pano]})
        })
    },
    visor_crear_instancia({commit,dispatch, getters},{id}){
        window.embedpano({
            xml:process.env.BASE_URL+`public/krpano/plugins/plantilla.xml`,
            // id:id,
            target:id,
            vars:{
                "idunico":"nose",
                "autorot":'false',
                "editar": false,
                notificar:()=>{
                    dispatch('visor_actualizar_pantalla')
                },
                llamada: false,     //establecer a una funcion llamable
                raizArchivos: process.env.VUE_APP_URL_S3,
                panos: [],// getters.visor_panos,
                tituloPanorama: '',// getters.visor_titulo,
                tourSpots: [],//getters.visor_tourSpots,
            },
            initvars:{
                'URLKRPANO': `/public/krpano`,
                'ROOT_URL' : `/public`,
                'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
            },
            onready: (p)=>{
                commit('visor_instancia_creada',p)
                dispatch('visor_actualizar_pantalla')
            },
            consolelog:true
        });
    },
    visor_actualizar_pantalla({getters}){
        const instancia = getters.visor_instancia
        if(instancia){
            instancia.set(`panos`,getters.visor_panos)
            instancia.set('tituloPanorama', getters.visor_titulo)
            instancia.set('tourSpots',getters.visor_tourSpots)
            instancia.call(`plugin[cargador].carga_dinamica('actualizado');`)
        }
    },
    visor_limpiar_pantalla({getters}){
        const instancia = getters.visor_instancia
        if(instancia){
            // instancia.call(`trace('Limpiando')`)
        }
    },
    visor_cambiar_pano({getters},{pano_id}){
        const instancia = getters.visor_instancia
        if(instancia){
            instancia.call(`plugin[cargador].cambiar_pano(${pano_id});`)
        }
    },
};

const mutations = {
    visor_cargando: state => {
        state.tourSpots = []
        state.panos = []
        state.tour = null
        state.statusVisor.panos = false
        state.statusVisor.tour = false
        state.statusVisor.tourSpot = false

    },
    visor_tour_cargado: (state,{tour}) => {
        state.tour = tour
        state.statusVisor.tour = true
    },
    visor_panos_cargado: (state,{panos}) => {
        state.panos = panos
        state.statusVisor.panos = true
    },
    visor_tourSpot_cargado: (state,{tourSpots}) => {
        state.tourSpots = tourSpots
        state.statusVisor.tourSpot = true
    },
    visor_instancia_creada: (state,instancia) => {
        state.instancia = instancia
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
