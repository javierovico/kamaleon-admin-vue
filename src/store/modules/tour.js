import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";

const state = {
    status: "",
    tours: [],
    tourById: null,
    audioActual: null,
};

const getters = {
    tour_tours: state => state.tours,
    tour_find_tour: state => id => state.tours.find(t=> t.id === id),
    tour_tour_by_id: state => state.tourById,
    tour_cargado: state => state.status === 'cargado',
    tour_cargando: state => state.status === 'cargando'
}

const actions = {
    tour_eliminar_fondo({dispatch,getters},{tour}){
        Vue.swal.fire({
            title: `Desasignar fondo del Tour ${tour.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si,Eliminar!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourEdit = Tour.fromSource(tour)
                tourEdit.fondo_id = 0
                dispatch('tour_guardar_cambios',{tour:tourEdit})
            }
        })
    },
    tour_asignar_fondo({dispatch},{archivo,tour}){
        let tourEdit = Tour.fromSource(tour)
        tourEdit.fondo_id = archivo.id
        dispatch('tour_guardar_cambios',{tour:tourEdit})
    },
    tour_view_reproducir_sonido({commit},{tour}){
        commit('tour_reproducir_sonido',{tour})
    },
    tour_view_parar_sonido({commit}){
        commit('tour_parar_sonido')
    },
    tour_guardar_cambios({commit,dispatch,getters},{tour}){
        const callBack = ()=> new Promise((res,rej)=>{
            axios({url:tour.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:tour.getMethodCarga(), data: tour.dataEnvio()}).then(r=>{
                tour.actualizarCambios(r.data)
                commit('tour_modificado',{tour})
                res({message:'Se Modifico el Tour'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    tour_view_toggle_estado({commit, dispatch, getters},{tour}){
        Vue.swal.fire({
            title: `${tour.activo?'Desactivar':'Activar'} Tour ${tour.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${tour.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourModificar = Tour.fromSource(tour)
                tourModificar.activo = tourModificar.activo?0:1
                dispatch('tour_guardar_cambios',{tour:tourModificar})
            }
        })
    },
    tour_view_crear_nuevo({dispatch}){
        let tour = new Tour()
        dispatch('tour_view_editar',{tour})
    },
    tour_view_editar({commit, dispatch, getters},{tour}){
        let tourEdit = Tour.fromSource(tour)
        const arrayPreguntas = crearArrayPreguntas(tourEdit,[
            {
                title:'Nombre del tour',
                key:'nombre',
                obligatorio:true,
            },
        ])
        Vue.swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            progressSteps: arrayPreguntas.map((q,index)=>`${index+1}`),
            showLoaderOnConfirm: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
        }).queue(arrayPreguntas).then((result) => {
            if (result.value) {
                dispatch('general_espera',{
                    callBack:()=>{
                        return new Promise((resolve,reject)=>{
                            dispatch('tour_guardar_cambios',{tour:tourEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    tour_cargar({ commit, dispatch }, {params}) {
        return new Promise((resolve, reject) => {
            commit('tour_cargando');
            axios({url: Tour.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM', params: params, method: 'GET' })
                .then(response => {
                    commit('tour_cargado', {response})
                    resolve({response})
                })
                .catch(err => {
                    commit('tour_error', err)
                    dispatch('general_error',err)
                    reject(err)
                })
        });
    },
    tour_tour_by_id({ commit, dispatch, getters }, {id,soloRetornar}) {
        return new Promise((resolve, reject) => {
            if(!soloRetornar){
                commit('tour_cargando');
            }
            let params = {
                // with:['panos.fondo'],
            }
            let tourF = getters.tour_find_tour(id)
            if(tourF){  //tourFind se encontro en los tours ya cargados
                if(!soloRetornar){
                    commit('tour_cargado_by_id', {tour:tourF})
                }
                resolve({
                    tour: tourF
                })
            }else{
                axios({
                    url: Tour.URL_DESCARGA+`/${id}`+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        const tour = Tour.fromSource(response.data)
                        if(!soloRetornar){
                            commit('tour_cargado_by_id', {tour})
                        }
                        resolve({
                            response,
                            tour
                        })
                    })
                    .catch(err => {
                        if(!soloRetornar){
                            commit('tour_error', err)
                            dispatch('general_error',err)
                        }
                        reject(err)
                    })
            }
        });
    },
    tour_asignar_panorama({dispatch},{tour,pano}){
        dispatch('general_confirmar',{titulo:'Asignar el panorama al tour?'}).then(()=>{
            dispatch('general_espera',{
                callBack:()=> new Promise((resolve,reject)=>{
                    axios({
                        url: tour.getUrlCarga() +'/'+ pano.getUrlCarga() + '/asignar',
                        method:'POST'
                    })
                        .catch(err => reject(err))
                        .then((response)=>{
                            dispatch('pano_agregar',{pano})
                            resolve()
                        })
                })
            })
        })
    },
    tour_desasignar_panorama({dispatch,commit},{tour,pano}){
        dispatch('general_confirmar',{titulo:'Desasignar el panorama del tour?'}).then(()=>{
            dispatch('general_espera',{
                callBack: () => new Promise((resolve,reject)=>{
                    axios({
                        url: tour.getUrlCarga() +'/'+ pano.getUrlCarga() + '/des-asignar',
                        method:'DELETE'
                    })
                        .catch(err => reject(err))
                        .then((response)=>{
                            dispatch('pano_quitar',{pano})
                            resolve()
                        })
                })
            })
        })
    },
};

const mutations = {
    tour_parar_sonido: (state) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = ''
        }
        state.tours.forEach(t=> {
            t._reproduciendo = false
        })
    },
    tour_reproducir_sonido: (state,{tour}) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = tour.fondo.url
        }else{
            state.audioActual = new Audio(tour.fondo.url)
        }
        state.audioActual.play()
        state.tours.forEach(t=> {
            t._reproduciendo = false
        })
        tour._reproduciendo = true
    },
    tour_modificado: (state,{tour}) =>{
        let tourBase = state.tours.find(t=>t.id === tour.id)
        if(tourBase){
            tourBase.actualizarCambios(tour)
        }else{
            state.tours.splice(0,0,tour)
        }
    },
    tour_cargando: state => {
        state.status = "cargando";
    },
    tour_cargado: (state,{response}) =>{
        state.status = 'cargado'
        state.tours = response.data.data.map(p=>Tour.fromSource(p))
    },
    tour_cargado_by_id: (state,{tour}) =>{
        state.status = 'cargado'
        state.tourById = tour
    },
    tour_error: (state,error) => {
        state.status = "error";
        // state.tours.splice(0,state.tours.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
