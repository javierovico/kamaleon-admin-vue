<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h3>articulo</h3>
            </b-col>
            <b-col cols="12">
                {{articulo}}
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import Articulo from "@/components/producto/Articulo";
    import {addQuery} from "@/Utils";
    export default {
        name: "ProductoView",
        props:[
            'empresa_id',
            'articulo_id',
        ],
        data(){
            return {
                articulo:null,
            }
        },
        mounted(){
            this.cargarArticulos()
        },
        methods:{
            abrirProducto(id){
                this.$router.push(addQuery(this.$route,{},`/producto/${id}`)).catch(e=>{})
            },
            cargarArticulos(){
                axios.get(`empresa/${this.empresa_id}/articulo/${this.articulo_id}?XDEBUG_SESSION_START=PHPSTORM`)
                    .then(response=>{
                        this.articul = Articulo.fromSource(response.data.data)
                    })
                    .catch(error=>{
                        console.log(error)
                        this.$bvToast.toast(`Error: ${error.response.data.message}`, {
                            title: 'Articulo',
                            autoHideDelay: 5000,
                            appendToast: false,
                            variant: 'danger',
                        })
                    })
                    .finally(()=>{
                        this.cargando = false
                    })
            }
        },
    }
</script>

<style scoped>

</style>