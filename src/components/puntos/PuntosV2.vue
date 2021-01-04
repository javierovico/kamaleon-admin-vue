<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h2>Puntos V2</h2>
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
                    <template #cell(tour)="data">
                        <h4><b-badge href="!#" @click.prevent="abrirTour(data.item)" :variant="data.item.tour_id?'success':'danger'">{{ data.item.tour_id?'Abrir':'NO'}}</b-badge></h4>
                    </template>
                    <template v-slot:cell(acciones)="data">
                        <div>
                            <b-button size="sm" variant="primary" class="mb-2" @click="puntoClick(data.item)" v-if="data.item.tour_id"  v-b-tooltip.hover title="Ver Tour">
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
    import {mapActions, mapGetters} from "vuex";
    import Vue from 'vue'

    export default {
        name: "PuntosV2",
        components:{Panos},
        props:['puntoCurrentPage','puntoBuscar','puntoSortBy','puntoSortByDesc','tourId'],
        watch:{
            puntoCurrentPage(){
                this.cargarToursInterno()
            },
            puntoBuscar(){
                this.cargarToursInterno()
            },
            puntoSortBy(){
                this.cargarToursInterno()
            },
            puntoSortByDesc(){
                this.cargarToursInterno()
            }
        },
        data(){
            return {
                currentPage:1,
                puntoPerPage:20,
                puntoTotalRows:10000,
                fields:[
                    {key:'id',label:'Id', sortable:true},
                    {key:'title',label:'Nombre', sortable: true},
                    {
                        key:'acciones',
                        label:'Accion'
                    },
                    'tour'
                ],
                form:{
                    nombre:'',
                },
            }
        },
        mounted(){
            this.form.nombre = this.puntoBuscar?this.puntoBuscar:''
            this.cargarToursInterno()
        },
        computed:{
            ...mapGetters({
                cargando: 'punto_cargando',
                puntos: 'punto_puntos'
            })
        },
        methods:{
            ...mapActions({
                cargarTours: 'punto_cargar',
            }),
            cargarToursInterno(){
                this.cargarTours({
                    params:{
                        perPage: this.puntoPerPage,
                        page: this.puntoCurrentPage,
                        buscar: this.puntoBuscar,
                        sortBy: this.puntoSortBy,
                        sortByDesc: this.puntoSortByDesc?'desc':'asc',
                    }
                }).then(({response})=>{
                    this.puntoTotalRows = response.data.total
                    //todo: aldo: hacer esta comprobacion siempre
                    if(this.page > response.data.last_page){
                        this.puntoPaginationClick(response.data.last_page)
                    }
                })
            },
            puntoPaginationClick(page){
                this.$router.push(addQuery(this.$route,{add:{puntoCurrentPage: page}}))
            },
            puntoBuscarClick(){
                this.$router.push(addQuery(this.$route,{add:{buscar: this.form.nombre},rem:['puntoCurrentPage']})).catch(e=>{
                    this.cargarToursInterno()
                })
            },
            puntoSortChange(evento){
                this.$router.push(addQuery(this.$route,{add:{puntoSortBy: evento.sortBy, puntoSortByDesc:evento.sortDesc?1:0}}))
            },
            puntoClick(punto){
                this.$router.push(addQuery(this.$route,{},`/puntos/${punto.tour_id}`))
            },
            abrirTour(punto){
                if(punto.tour_id){
                    this.$router.push(addQuery(this.$route,{},`/tour/${punto.tour_id}`))
                }else{
                    Vue.swal.fire({
                        title:'No se tiene ningun tour asociado',
                        icon:'error'
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>