import Vue from 'vue'
const state = {
    status: "",
    categorias: [],
    errorString: '',
    statusPila: '',
    categoriasPila: [],
}


const getters = {

}

const mutations = {
}

const actions = {
    general_espera ({commit, dispatch, getters}, dato) {
        const callBack = dato.callBack
        Vue.swal.fire({
            icon: 'info',
            allowOutsideClick:false,
            allowEscapeKey: false,
            title: 'Espere',
            showConfirmButton: false,
            // timer: 4500,
            willOpen: () => {
                Vue.swal.showLoading()
                callBack().then(r=>{
                    const message = r.message
                    const Toast = Vue.swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Vue.swal.stopTimer)
                            toast.addEventListener('mouseleave', Vue.swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: message
                    })
                }).catch(e=>{
                    dispatch('general_error',e)
                })
            },
        })
    },
    general_error({commit,dispatch,getters},e){
        console.error(e)
        const titulo = (e.response && e.response.data.message) ? e.response.data.message : 'Error'
        const texto = `${e}`
        Vue.swal.fire({
            icon: 'error',
            title: titulo,
            text: texto,
            showConfirmButton: true,
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
