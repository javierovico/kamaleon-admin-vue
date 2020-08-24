<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h2>Puntos</h2>
            </b-col>
            <b-col lg="6" class="my-1">
                <b-form @submit.prevent="loadPuntos(1)">
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
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :busy="cargando" head-variant="dark" small striped hover :items="puntos" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                </b-table>
            </b-col>
            <b-col sm="7" md="6" class="my-1">
                <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                        @change="loadPuntos"
                ></b-pagination>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import {Punto} from "@/components/puntos/Punto";

    export default {
        name: "Puntos",
        data(){
            return {
                currentPage:1,
                perPage:10,
                totalRows:1,
                cargando: false,
                puntos:[],
                fields:[
                    {key:'id',label:'Id'},
                    {key:'title',label:'Nombre'}
                ],
                form:{
                    nombre:'',
                },
                sortBy: 'nombre',
                sortDesc: false,
            }
        },
        mounted(){
            this.loadPuntos()
        },
        methods:{
            loadPuntos(current = 1){
                axios.get('punto',{params:{
                    perPage: this.perPage,
                    page: current,
                }}).then(response=>{
                    this.puntos.splice(0,this.puntos.length)
                    response.data.data.forEach(data=>{
                        this.puntos.push(Punto.fromSource(data))
                    })
                    this.currentPage = current
                    this.totalRows = response.data.total
                })
            }
        }
    }
</script>

<style scoped>

</style>