<template>
    <b-container fluid>
        <b-row>
            <b-col :cols="departamentoId!==null?6:12">
                <b-col cols="12">
                    <h2>Departamentos</h2>
                </b-col>
                <b-col cols="12">
                    <b-table
                            :no-local-sorting="true"
                            show-empty
                            :sort-by.sync="sortBy"
                            :sort-desc.sync="sortDesc"
                            :busy="cargando" head-variant="dark" small striped hover :items="departamentos" :fields="fields">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template v-slot:cell(acciones)="data">
                            <div>
                                <b-button size="sm" variant="primary" class="mb-2" @click="$router.push(`/mapa/${data.item.id}`)">
                                    <b-icon icon="eye" aria-label="Help"></b-icon>
                                </b-button>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols="12">
<!--                    <template>-->
<!--                        <div class="overflow-auto">-->
<!--                            <b-pagination-nav :link-gen="departamento_linkGen" :number-of-pages="departamento_lastPage" use-router></b-pagination-nav>-->
<!--                        </div>-->
<!--                    </template>-->
                    <b-pagination
                            :value="departamentoId"
                            :per-page="perPage"
                            :total-rows="departamento_totalRow"
                            align="fill"
                            size="sm"
                            class="my-0"
                            @change="departamentoPaginationClick"
                    ></b-pagination>
                </b-col>
            </b-col>
            <template v-if="departamentoSelected !== null">
                <b-col cols="6">
                    <b-col cols="12">
                        <h2>Ciudades de {{departamentoSelected.nombre}}</h2>
                    </b-col>
                    <b-col cols="12">
                        <b-table
                                :no-local-sorting="true"
                                show-empty
                                :sort-by.sync="ciudad_sortBy"
                                :sort-desc.sync="ciudad_sortDesc"
                                :busy="ciudad_cargando" head-variant="dark" small striped hover :items="ciudades" :fields="ciudad_fields">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(acciones)="data">
                                <div>
                                    <b-button size="sm" variant="primary" class="mb-2" @click="$router.push(`/mapa/${data.item.id}`)">
                                        <b-icon icon="eye" aria-label="Help"></b-icon>
                                    </b-button>
                                </div>
                            </template>
                        </b-table>
                    </b-col>
                    <b-col cols="12">
<!--                        <template>-->
<!--                            <div class="overflow-auto">-->
<!--                                <b-pagination-nav :link-gen="ciudad_linkGen" :number-of-pages="departamento_lastPage" use-router></b-pagination-nav>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                        <b-pagination-->
<!--                                v-model="ciudad_currentPage"-->
<!--                                :total-rows="ciudad_totalRows"-->
<!--                                :per-page="perPage"-->
<!--                                align="fill"-->
<!--                                size="sm"-->
<!--                                class="my-0"-->
<!--                                @change="cargarCiudades()"-->
<!--                        ></b-pagination>-->
                    </b-col>
                </b-col>
            </template>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import Departamento from "@/components/Mapa/Departamento";
    import Ciudad from "@/components/Mapa/Ciudad";
    import {addQuery} from "@/Utils";
    export default {
        name: "Mapa",
        props: {
            departamentoId: {
                // type: String,
                default: null
            },
            depCurrentPage:{
                default:1
            },
            ciuCurrentPage:{
                default:1
            }
        },
        computed:{

        },
        data(){
            return {
                departamento_totalRow:1000,
                perPage:10,
                sortBy:'numero',
                sortDesc: false,
                cargando: false,
                fields:[
                    {
                        key: 'numero',
                        label: 'Numero',
                        sortable: true,
                    },
                    {
                        key: 'nombre',
                        label: 'Nombre',
                        sortable: true,
                    },
                    {
                        key:'ciudades_count',
                        label:'Cantidad Ciudades',
                    },
                    {
                        key:'acciones',
                        label:'Accion'
                    }
                ],
                ciudad_currentPage:1,
                ciudad_totalRows:1,
                ciudad_sortBy:'numero',
                ciudad_sortDesc: false,
                ciudad_cargando: false,
                ciudad_fields:[
                    {
                        key: 'numero',
                        label: 'Numero',
                        sortable: true,
                    },
                    {
                        key: 'nombre',
                        label: 'Nombre',
                        sortable: true,
                    },
                    {
                        key:'acciones',
                        label:'Accion'
                    }
                ],
                departamentos: [],
                departamentoSelected:new Departamento(),
                ciudades:[],
            }
        },
        watch: {
            sortBy() {
                this.cargarDepartamentos(1)
            },
            sortDesc(){
                this.cargarDepartamentos(1)
            },
            departamentoId(){
                const dep = this.departamentos.find(dep=>dep.id === this.departamentoId)
                this.departamentoSelected =  dep? (Departamento.fromSource(dep)):null
                this.cargarCiudades(1)
            },
            depCurrentPage(){
                this.cargarDepartamentos()
            }
        },
        mounted(){
            this.cargarDepartamentos()
            if(this.departamentoId !==null){
                this.cargarCiudades(1)
            }
            if(!this.departamentoSelected.isCreated()){
                this.cargarDepartamentoPrincipal()
            }
        },
        methods:{
            cargarCiudades(page = 1){
                if(this.ciudad_cargando)
                    return
                this.ciudades.splice(0,this.ciudades.length)
                if(this.departamentoId === null){
                    return
                }
                this.ciudad_cargando = true
                axios.get(`location/departamento/${this.departamentoId}/ciudad`,{params:{
                    page: page,
                    perPage: this.perPage,
                    sortBy: this.ciudad_sortBy.length>0?(this.ciudad_sortBy):null,
                    direction: this.ciudad_sortDesc?'desc':'asc',
                    // counts: ['ciudades']
                }}).then(response=>{
                    response.data.data.forEach(dep=>{
                        this.ciudades.push(Ciudad.fromSource(dep))
                    })
                    this.ciudad_currentPage = page
                    this.ciudad_totalRows = response.data.total
                    this.ciudad_cargando = false
                })
            },
            cargarDepartamentos(/*page = 1*/){
                if(this.cargando)
                    return
                this.departamentos.splice(0,this.departamentos.length)
                this.cargando = true
                axios.get('location/departamento',{params:{
                    page: this.depCurrentPage,
                    perPage: this.perPage,
                    sortBy: this.sortBy.length>0?(this.sortBy):null,
                    direction: this.sortDesc?'desc':'asc',
                    counts: ['ciudades']
                }}).then(response=>{
                    response.data.data.forEach(dep=>{
                        this.departamentos.push(Departamento.fromSource(dep))
                    })
                    this.departamento_totalRow = response.data.total
                    this.cargando = false
                })
            },
            departamentoPaginationClick(page){
                this.$router.push(addQuery({depCurrentPage: page},this.$route))
            },
            cargarDepartamentoPrincipal(){
                if(this.departamentoId === null){
                    return
                }
                axios.get(`location/departamento/${this.departamentoId}`).then(response=>{
                    this.departamentoSelected = response.data.data
                })
            },
            departamento_linkGen(pageNum) {
                return {
                    query:{
                        depCurrentPage: pageNum
                    }
                }
                // return pageNum === 1 ? '?' : `?depCurrentPage=${pageNum}`
            },
            ciudad_linkGen(pageNum) {
                return pageNum === 1 ? '?' : `?ciuCurrentPage=${pageNum}`
            },
        }
    }
</script>

<style scoped>

</style>