<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h2>Puntos</h2>
            </b-col>
            <b-col lg="6" class="my-1">
                <b-form @submit.prevent="puntoBuscarClick()">
                    <b-form-group
                            label="Nombre:"
                            label-cols-sm="3"
                            label-align-sm="right"
                            label-size="sm"
                            label-for="filterInput"
                            class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                    v-model="form.nombre"
                                    type="search"
                                    id="filterInput"
                                    placeholder="..."
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button type="submit" variant="primary">Buscar</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-form>
            </b-col>
            <b-col cols="12">
                <b-table
                        :no-local-sorting="true"
                        show-empty
                        :sort-by="puntoSortBy"
                        :sort-desc="puntoSortByDesc"
                        @sort-changed="puntoSortChange"
                        :busy="cargando" head-variant="dark" small striped hover :items="puntos" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                    <template v-slot:cell(acciones)="data">
                        <div>
                            <b-button size="sm" variant="primary" class="mb-2" @click="puntoClick(data.item)" v-if="data.item.tour_id">
                                <b-icon icon="eye" aria-label="Help"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
            </b-col>
            <b-col cols="12">
                <b-pagination
                        :value="puntoCurrentPage"
                        :per-page="puntoPerPage"
                        :total-rows="puntoTotalRows"
                        align="fill"
                        size="sm"
                        class="my-0"
                        @change="puntoPaginationClick"
                ></b-pagination>
            </b-col>
            <b-col cols="12" v-if="tourId">
                <Panos
                    :tour-id="tourId"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import {Punto} from "@/components/puntos/Punto";
    import {addQuery} from "@/Utils";
    import Panos from "@/components/panos/Panos";

    export default {
        name: "Puntos",
        components:{Panos},
        props:['puntoCurrentPage','puntoBuscar','puntoSortBy','puntoSortByDesc','tourId'],
        watch:{
            puntoCurrentPage(){
                this.loadPuntos()
            },
            puntoBuscar(){
                this.loadPuntos()
            },
            puntoSortBy(){
                this.loadPuntos()
            },
            puntoSortByDesc(){
                this.loadPuntos()
            }
        },
        data(){
            return {
                currentPage:1,
                puntoPerPage:10,
                puntoTotalRows:10000,
                cargando: false,
                puntos:[],
                fields:[
                    {key:'id',label:'Id', sortable:true},
                    {key:'title',label:'Nombre', sortable: true},
                    {
                        key:'acciones',
                        label:'Accion'
                    }
                ],
                form:{
                    nombre:'',
                },
            }
        },
        mounted(){
            this.form.nombre = this.puntoBuscar?this.puntoBuscar:''
            this.loadPuntos()
        },
        methods:{
            loadPuntos(){
                axios.get('punto',{params:{
                    perPage: this.puntoPerPage,
                    page: this.puntoCurrentPage,
                    buscar: this.puntoBuscar,
                    sortBy: this.puntoSortBy,
                    sortByDesc: this.puntoSortByDesc?'desc':'asc',
                }}).then(response=>{
                    this.puntos.splice(0,this.puntos.length)
                    response.data.data.forEach(data=>{
                        this.puntos.push(Punto.fromSource(data))
                    })
                    this.puntoTotalRows = response.data.total
                })
            },
            puntoPaginationClick(page){
                this.$router.push(addQuery(this.$route,{add:{puntoCurrentPage: page}}))
            },
            puntoBuscarClick(){
                this.$router.push(addQuery(this.$route,{add:{buscar: this.form.nombre},rem:['puntoCurrentPage']}))
            },
            puntoSortChange(evento){
                this.$router.push(addQuery(this.$route,{add:{puntoSortBy: evento.sortBy, puntoSortByDesc:evento.sortDesc?1:0}}))
            },
            puntoClick(punto){
                this.$router.push(addQuery(this.$route,{},`/puntos/${punto.tour_id}`))
            }
        }
    }
</script>

<style scoped>

</style>