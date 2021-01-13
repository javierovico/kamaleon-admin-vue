import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import TourSpot from "@/store/modelos/TourSpot";

const state = {
    instancia_visor: [],

    statusVisor:[],
    // statusVisor: {  //indica si ya fueron cargados
    //     tour: false,
    //     tourSpot: false,
    //     panos: false,
    // },
    tourSpots: [],
    tour: [],
    panos: [],
    instancia: [],        //TODO: ver cuando restablecer
};

const getters = {
    visor_instancia_visor: state => idVisor => state.instancia_visor.find(o=> o.idVisor === idVisor),
    visor_tourSpots: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.tourSpots,
    visor_tour: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.tour,
    visor_panos: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.panos,
    visor_status_visor: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.statusVisor,
    visor_cargado: (state,getters) => idVisor => (getters.visor_status_visor(idVisor) && getters.visor_status_visor(idVisor).tourSpot && getters.visor_status_visor(idVisor).tour && getters.visor_status_visor(idVisor).panos),
    visor_titulo: (state,getters) => idVisor => {
        if(!getters.visor_cargado(idVisor)){
            return `No Cargado`
        }else if(state.tour){
            return state.tour.nombre
        }else{
            return ``
        }
    },
    visor_instancia: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.instancia,
}

const actions = {
    visor_restablecer({commit,dispatch},{idVisor}){
        commit('visor_cargando',{idVisor})
    },
    visor_cargar_by_tour_id({ commit, dispatch }, {idVisor,id,params}) {  //carga los parametros a parir del tourID
        dispatch('visor_restablecer',{idVisor})
        dispatch('tour_tour_by_id',{id,soloRetornar: true}).then(({tour})=>{
            commit('visor_tour_cargado',{tour,idVisor})
        })
        dispatch('pano_cargar_by_tour_id',{id,params,soloRetornar:true}).then(({panos})=>{
            commit('visor_panos_cargado',{panos,idVisor})
        })
        dispatch('tourSpot_cargar_by_tour_id',{id,params,soloRetornar:true}).then(({tourSpots})=>{
            commit('visor_tourSpot_cargado',{tourSpots,idVisor})
        })
    },
    visor_cargar_by_pano_id({ commit, dispatch }, {id,params,idVisor}) {  //carga los parametros a parir del panoId
        dispatch('visor_restablecer',{idVisor})
        commit('visor_tour_cargado',{tour:null,idVisor})
        commit('visor_tourSpot_cargado',{tourSpots:[],idVisor})
        dispatch('pano_pano_by_id',{id,params,soloRetornar:true}).then(({pano})=>{
            commit('visor_panos_cargado',{panos:[pano],idVisor})
        })
    },
    visor_crear_instancia({commit,dispatch, getters},{idVisor}){
        window.embedpano({
            xml:process.env.BASE_URL+`public/krpano/plugins/plantilla.xml`,
            // id:id,
            target:idVisor,
            vars:{
                "idunico":"nose",
                "autorot":'false',
                "editar": false,
                notificar:()=>{
                    dispatch('visor_actualizar_pantalla',{idVisor})
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
            onready: (instancia)=>{
                commit('visor_instancia_creada', {instancia,idVisor})
                dispatch('visor_actualizar_pantalla',{idVisor})
            },
            consolelog:true
        });
    },
    visor_actualizar_pantalla({getters},{idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            instancia.set(`panos`,getters.visor_panos(idVisor))
            instancia.set('tituloPanorama', getters.visor_titulo(idVisor))
            instancia.set('tourSpots',getters.visor_tourSpots(idVisor))
            instancia.call(`plugin[cargador].carga_dinamica('actualizado');`)
        }
    },
    visor_limpiar_pantalla({getters},{idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            // instancia.call(`trace('Limpiando')`)
        }
    },
    visor_cambiar_pano({getters},{pano_id,idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            instancia.call(`plugin[cargador].cambiar_pano(${pano_id});`)
        }
    },
};

const mutations = {
    visor_cargando: (state,{idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        if(!instancia){
            instancia = {
                idVisor:idVisor,
                statusVisor: {},
            }
            state.instancia_visor.push(instancia)
        }
        instancia.tourSpots = []
        instancia.panos = []
        instancia.tour = null
        instancia.statusVisor.panos = false
        instancia.statusVisor.tour = false
        instancia.statusVisor.tourSpot = false
    },
    visor_tour_cargado: (state,{tour,idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.tour = tour
        instancia.statusVisor.tour = true
    },
    visor_panos_cargado: (state,{panos,idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.panos = panos
        instancia.statusVisor.panos = true
    },
    visor_tourSpot_cargado: (state,{tourSpots,idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.tourSpots = tourSpots
        instancia.statusVisor.tourSpot = true
    },
    visor_instancia_creada: (state, {instancia,idVisor}) => {
        let instanciar = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instanciar.instancia = instancia
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
