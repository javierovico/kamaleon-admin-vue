<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h3>articulos</h3>
            </b-col>
            <b-col cols="12">
                <b-container fluid>
                    <b-row>
                        <b-col
                                :key="articulo.id"
                                v-for="articulo in articulos"
                                cols="12" sm="6" md="6" lg="4" xl="3"
                                class="p-3"
                        >
                            <div>
                                <b-card @click.prevent="abrirProducto(articulo.id)" no-body class="overflow-hidden" style="max-width: 540px;"
                                        :footer="'Precio: ' + articulo.precio + ' Gs.'">
                                    <b-row no-gutters>
                                        <b-col md="6">
                                            <b-card-img :src="articulo.miniatura.url" alt="Image" class="rounded-0"></b-card-img>
                                        </b-col>
                                        <b-col md="6">
                                            <b-card-body :title="articulo.nombre">
                                                <b-card-text>
                                                    <template v-if="articulo.descripcion">
                                                        Descripcion: {{articulo.descripcion}}
                                                    </template>
                                                </b-card-text>
                                            </b-card-body>
                                        </b-col>
                                    </b-row>
                                </b-card>
                            </div>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import Articulo from "@/components/producto/Articulo";
    import {addQuery} from "@/Utils";
    export default {
        name: "ProductoListView",
        props:[
            'empresa_id',
            'propNombre',
        ],
        data(){
            return {
                articulos:[],
                totalRow:1000,
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
                axios.get(`empresa/${this.empresa_id}/articulo?XDEBUG_SESSION_START=PHPSTORM`,{params:{
                        perPage: this.perPage,
                        page:this.page,
                        nombre: this.propNombre,
                        // sortBy:this.sortBy,
                        // order: this.order?'asc':'desc',
                    }})
                    .then(response=>{
                        this.articulos.splice(0,this.articulos.length)
                        response.data.data.forEach(d=>{
                            this.articulos.push(Articulo.fromSource(d))
                        })
                        this.totalRow = response.data.total
                    })
                    .catch(error=>{
                        this.$bvToast.toast(`Error: ${error.response.data.message}`, {
                            title: 'Articulos',
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