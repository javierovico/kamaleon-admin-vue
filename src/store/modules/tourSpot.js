import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";
import TourSpot from "@/store/modelos/TourSpot";

const state = {
    status: "",
    tourSpots: [],
    tourSpotById: null,
    audioActual: null,
};

const getters = {
    tourSpot_tourSpots: state => state.tourSpots,
    tourSpot_tourSpot_by_id: state => state.tourSpotById,
    tourSpot_cargado: state => state.status === 'cargado',
    tourSpot_cargando: state => state.status === 'cargando'
}

const actions = {
    tourSpot_eliminar_fondo({dispatch,getters},{tourSpot}){
        Vue.swal.fire({
            title: `Desasignar fondo del TourSpotrama ${tourSpot.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si,Eliminar!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourSpotEdit = TourSpot.fromSource(tourSpot)
                tourSpotEdit.fondo_id = 0
                dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotEdit})
            }
        })
    },
    tourSpot_asignar_fondo({dispatch},{archivo,tourSpot}){
        let tourSpotEdit = TourSpot.fromSource(tourSpot)
        tourSpotEdit.fondo_id = archivo.id
        dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotEdit})
    },
    tourSpot_guardar_cambios({commit,dispatch,getters},{tourSpot}){
        const callBack = ()=> new Promise((res,rej)=>{
            axios({url:tourSpot.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:tourSpot.getMethodCarga(), data: tourSpot.dataEnvio()}).then(r=>{
                tourSpot.actualizarCambios(r.data)
                commit('tourSpot_modificado',{tourSpot})
                res({message:'Se Modifico el TourSpot'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    tourSpot_view_toggle_estado({commit, dispatch, getters},{tourSpot}){
        Vue.swal.fire({
            title: `${tourSpot.activo?'Desactivar':'Activar'} TourSpotrama ${tourSpot.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${tourSpot.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourSpotModificar = TourSpot.fromSource(tourSpot)
                tourSpotModificar.activo = tourSpotModificar.activo?0:1
                dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotModificar})
            }
        })
    },
    tourSpot_view_editar({commit, dispatch, getters},{tourSpot}){
        let tourSpotEdit = TourSpot.fromSource(tourSpot)
        const arrayPreguntas = crearArrayPreguntas(tourSpotEdit,[
            {
                title:'Nombre del tourSpot',
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
                            dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    tourSpot_cargar_by_tour({ commit, dispatch }, {tour,params}) {
        return new Promise((resolve, reject) => {
            commit('tourSpot_cargando');
            if(tour){
                axios({
                    url: tour.getUrlCarga() + TourSpot.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        commit('tourSpot_cargado', {response})
                        resolve({response})
                    })
                    .catch(err => {
                        commit('tourSpot_error', err)
                        dispatch('general_error',err)
                        reject(err)
                    })
            }else{
                return
            }
        });
    },
    tourSpot_tourSpot_by_id({ commit, dispatch }, {id}) {
        return new Promise((resolve, reject) => {
            commit('tourSpot_cargando');
            let params = {
                // with:['tourSpots.fondo'],
            }
            axios({
                url: TourSpot.URL_DESCARGA+`/${id}`+'?XDEBUG_SESSION_START=PHPSTORM',
                params: params,
                method: 'GET'
            })
                .then(response => {
                    commit('tourSpot_cargado_by_id', {response})
                    resolve({response})
                })
                .catch(err => {
                    commit('tourSpot_error', err)
                    dispatch('general_error',err)
                    reject(err)
                })
        });
    },
};

const mutations = {
    tourSpot_modificado: (state,{tourSpot}) =>{
        let tourSpotBase = state.tourSpots.find(t=>t.id === tourSpot.id)
        if(tourSpotBase){
            tourSpotBase.actualizarCambios(tourSpot)
        }else{
            state.tourSpots.push(tourSpot)
        }
    },
    tourSpot_cargando: state => {
        state.status = "cargando";
    },
    tourSpot_cargado: (state,{response}) =>{
        state.status = 'cargado'
        state.tourSpots = response.data.data.map(p=>TourSpot.fromSource(p))
    },
    tourSpot_cargado_by_id: (state,{response}) =>{
        state.status = 'cargado'
        state.tourSpotById = TourSpot.fromSource(response.data)
    },
    tourSpot_error: (state,error) => {
        state.status = "error";
        // state.tourSpots.splice(0,state.tourSpots.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
