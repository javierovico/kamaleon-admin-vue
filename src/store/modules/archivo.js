import axios from "axios";
import Archivo from "@/store/modelos/Archivo";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";

const state = {
    status: "",
    archivos: [],
    audioActual: null,
};

const getters = {
    archivo_archivos: state => state.archivos,
    archivo_cargado: state => state.status === 'cargado',
    archivo_cargando: state => state.status === 'cargando'
}

const actions = {
    archivo_view_reproducir_sonido({commit},{archivo}){
        commit('archivo_reproducir_sonido',{archivo})
    },
    archivo_view_parar_sonido({commit}){
        commit('archivo_parar_sonido')
    },
    archivo_guardar_cambios({commit,dispatch,getters},{archivo}){
        const callBack = ()=> new Promise((res,rej)=>{
            let url = archivo.getUrlCarga()
            axios({url:archivo.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:archivo.getMethodCarga(), data: archivo.dataEnvio()}).then(r=>{
                archivo.actualizarCambios(r.data)
                commit('archivo_modificado',{archivo})
                res({message:'Se Modifico el Tour'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    archivo_view_toggle_estado({commit, dispatch, getters},{archivo}){
        Vue.swal.fire({
            title: `${archivo.activo?'Desactivar':'Activar'} Tour ${archivo.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${archivo.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let archivoModificar = Archivo.fromSource(archivo)
                archivoModificar.activo = archivoModificar.activo?0:1
                dispatch('archivo_guardar_cambios',{archivo:archivoModificar})
            }
        })
    },
    archivo_view_editar({commit, dispatch, getters},{archivo}){
        let archivoEdit = Archivo.fromSource(archivo)
        const arrayPreguntas = crearArrayPreguntas(archivoEdit,[
            {
                title:'Nombre del archivo',
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
                            dispatch('archivo_guardar_cambios',{archivo:archivoEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    archivo_cargar({ commit, dispatch}, {params}) {
        return new Promise((resolve, reject) => {
            commit('archivo_cargando');
            axios({url: Archivo.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM', params: params, method: 'GET' })
                .then(response => {
                    commit('archivo_cargado', {response})
                    resolve({response})
                })
                .catch(err => {
                    commit('archivo_error', err)
                    dispatch('general_error',err)
                    reject(err)
                })
        });
    },
};

const mutations = {
    archivo_parar_sonido: (state) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = ''
        }
        state.archivos.forEach(t=> {
            t._reproduciendo = false
        })
    },
    archivo_reproducir_sonido: (state,{archivo}) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = archivo.url
        }else{
            state.audioActual = new Audio(archivo.url)
        }
        state.audioActual.play()
        state.archivos.forEach(t=> {
            t._reproduciendo = false
        })
        archivo._reproduciendo = true
    },
    archivo_modificado: (state,{archivo}) =>{
        let archivoBase = state.archivos.find(t=>t.id === archivo.id)
        if(archivoBase){
            archivoBase.actualizarCambios(archivo)
        }else{
            state.archivos.push(archivo)
        }
    },
    archivo_cargando: state => {
        state.status = "cargando";
    },
    archivo_cargado: (state,{response}) =>{
        state.status = 'cargado'
        state.archivos = response.data.data.map(p=>Archivo.fromSource(p))
    },
    archivo_error: (state,error) => {
        state.status = "error";
        // state.archivos.splice(0,state.archivos.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
