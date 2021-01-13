import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";
import Pano from "@/store/modelos/Pano";

const state = {
    status: "",
    panos: [],
    panoById: null,
    audioActual: null,
};

const getters = {
    pano_panos: state => state.panos,
    pano_find_by_id: state => id => state.panos.find(p=> p.id === id),
    pano_pano_by_id: state => state.panoById,
    pano_cargado: state => state.status === 'cargado',
    pano_cargando: state => state.status === 'cargando'
}

const actions = {
    pano_quitar({commit},{pano}){    //quita un pano de la lista
        commit('pano_quitar',{pano})
    },
    pano_agregar({commit},{pano}){    //quita un pano de la lista
        commit('pano_agregar',{pano})
    },
    pano_eliminar_fondo({dispatch,getters},{pano}){
        Vue.swal.fire({
            title: `Desasignar fondo del Panorama ${pano.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si,Eliminar!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let panoEdit = Pano.fromSource(pano)
                panoEdit.fondo_id = 0
                dispatch('pano_guardar_cambios',{pano:panoEdit})
            }
        })
    },
    pano_asignar_fondo({dispatch},{archivo,pano}){
        let panoEdit = Pano.fromSource(pano)
        panoEdit.fondo_id = archivo.id
        dispatch('pano_guardar_cambios',{pano:panoEdit})
    },
    pano_guardar_cambios({commit,dispatch,getters},{pano}){
        const callBack = ()=> new Promise((res,rej)=>{
            axios({url:pano.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:pano.getMethodCarga(), data: pano.dataEnvio()}).then(r=>{
                pano.actualizarCambios(r.data)
                commit('pano_modificado',{pano})
                res({message:'Se Modifico el Pano'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    pano_view_toggle_estado({commit, dispatch, getters},{pano}){
        Vue.swal.fire({
            title: `${pano.activo?'Desactivar':'Activar'} Panorama ${pano.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${pano.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let panoModificar = Pano.fromSource(pano)
                panoModificar.activo = panoModificar.activo?0:1
                dispatch('pano_guardar_cambios',{pano:panoModificar})
            }
        })
    },
    pano_view_editar({commit, dispatch, getters},{pano}){
        let panoEdit = Pano.fromSource(pano)
        const arrayPreguntas = crearArrayPreguntas(panoEdit,[
            {
                title:'Nombre del pano',
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
                            dispatch('pano_guardar_cambios',{pano:panoEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    pano_cargar_by_tour_id({commit,dispatch},{id,params,soloRetornar}){
        return new Promise((resolve, reject) => {
            if(!soloRetornar){
                commit('pano_cargando');
            }
            axios({
                url: Tour.urlCargaFromId(id) + Pano.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM',
                params: params,
                method: 'GET'
            })
                .then(response => {
                    const panos = response.data.data.map(p=>Pano.fromSource(p))
                    if(!soloRetornar){
                        commit('pano_cargado', {panos})
                    }
                    resolve({response,panos})
                })
                .catch(err => {
                    if(!soloRetornar){
                        commit('pano_error', err)
                        dispatch('general_error',err)
                    }
                    reject(err)
                })
        });
    },
    pano_cargar_by_tour({ commit, dispatch, getters}, {tour,params}) {
        return dispatch('pano_cargar_by_tour_id',{id:tour.id,params})
    },
    pano_pano_by_id({ commit, dispatch, getters}, {id,soloRetornar}) {
        return new Promise((resolve, reject) => {
            if(!soloRetornar){
                commit('pano_cargando');
            }
            let params = {
                // with:['panos.fondo'],
            }
            let pano = getters.pano_find_by_id(id)
            if(pano){
                if(!soloRetornar){
                    commit('pano_cargado_by_id', {pano})
                }
                resolve({pano})
            }else{
                axios({
                    url: Pano.urlCargaFromId(id)/*Pano.URL_DESCARGA+`/${id}`*/+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        pano = Pano.fromSource(response.data)
                        if(!soloRetornar){
                            commit('pano_cargado_by_id', {pano})
                        }
                        resolve({response,pano})
                    })
                    .catch(err => {
                        if(!soloRetornar){
                            commit('pano_error', err)
                            dispatch('general_error',err)
                        }
                        reject(err)
                    })
            }
        });
    },
    pano_cargar({getters},{params,soloRetornar}){
        return new Promise((resolve,reject)=>{
            axios({
                url:Pano.urlCargaFromId(null),
                params: params,
                method: 'GET',
            }).then(response=>{
                let panos = response.data.data.map(p=>Pano.fromSource(p))
                if(!soloRetornar){
                    throw 'falta completar 1ut32xx'
                }
                resolve({response,panos})
            }).catch(err=>{
                if(!soloRetornar){
                    throw 'falta completar 11AB58C'
                }
                reject(err)
            })
        })
    },
};

const mutations = {
    pano_modificado: (state,{pano}) =>{
        let panoBase = state.panos.find(t=>t.id === pano.id)
        if(panoBase){
            panoBase.actualizarCambios(pano)
        }else{
            state.panos.push(pano)
        }
    },
    pano_quitar: (state,{pano}) => {
        const panoIndex = state.panos.findIndex(p=>p.id === pano.id)
        if(panoIndex){
            state.panos.splice(panoIndex,1)
        }else{
            console.error('No se encontro el pano a quitar')
        }
    },
    pano_agregar: (state,{pano}) => {
        state.panos.push(pano)
    },
    tour_cargado: (state,{response}) =>{
        console.log(response)
    },
    pano_cargando: state => {
        state.status = "cargando";
    },
    pano_cargado: (state,{panos}) =>{
        state.status = 'cargado'
        state.panos = panos
    },
    pano_cargado_by_id: (state,{pano}) =>{
        state.status = 'cargado'
        state.panoById = pano
    },
    pano_error: (state,error) => {
        state.status = "error";
        // state.panos.splice(0,state.panos.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
