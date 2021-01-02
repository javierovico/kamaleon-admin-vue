<template>
    <div>
        <SinAcceso v-if="!permisoParaVer"/>
        <b-container fluid v-else>
            <b-row class="justify-content-md-center">
                <b-col cols="12" class="pt-5">
                    <div>
                        <b-navbar type="light" variant="light" toggleable="lg">
                            <b-navbar-brand><h3>{{titulo}}</h3></b-navbar-brand>
                            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                            <b-collapse id="nav-collapse" is-nav>
                                <b-navbar-nav class="ml-auto">
                                    <b-nav-form @submit.prevent="buscarUsuarios()">
                                        <b-form-input v-model="formBuscar" class="mr-sm-2" placeholder="Archivo..."></b-form-input>
                                        <b-button variant="outline-success" class="my-2 my-sm-0" type="submit">Buscar</b-button>
                                    </b-nav-form>
<!--                                    <b-nav-form class="ml-3">-->
<!--                                        <b-button @click.prevent="crearMotivo({empresa_id})" variant="info" class="my-2 my-sm-0" type="submit">-->
<!--                                            <b-icon icon="plus" aria-hidden="true"></b-icon>-->
<!--                                            Crear Motivo-->
<!--                                        </b-button>-->
<!--                                    </b-nav-form>-->
                                </b-navbar-nav>
                            </b-collapse>
                        </b-navbar>
                    </div>
                </b-col>
                <b-col cols="12">
                    <b-table
                            :per-page="perPage"
                            :sort-by.sync="sortBy"
                            :sort-desc.sync="sortDesc"
                            :no-local-sorting="true"
                            responsive
                            striped hover
                            show-empty
                            :busy="!tablaCargada" :items="archivos" :fields="columnas">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template #cell(activo)="data">
                            <h4><b-badge href="!#" @click.prevent="toggleEstadoArchivo({archivo:data.item})" :variant="data.value?'success':'danger'">{{ data.value?'SI':'NO' }}</b-badge></h4>
                        </template>
                        <template #cell(accion)="data">
                            <template v-if="data.item._reproduciendo">  <!-- Si es que esta reproduciendo -->
                                <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="pararFondoArchivo()" v-b-tooltip.hover title="Parar">
                                    <b-icon icon="stop"  ></b-icon>
                                </b-button>
                            </template>
                            <template v-else>  <!-- Si es que No esta reproduciendo -->
                                <div class="h2 mb-0">
                                    <b-button variant="outline-success" size="sm" class="mb-2" @click.prevent="archivoSeleccionado(data.item)" v-b-tooltip.hover title="Seleccionar">
                                        <b-icon font-scale="1" icon="check-circle" ></b-icon>
                                    </b-button>
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="reproducirFondoArchivo({archivo:data.item})" v-b-tooltip.hover title="Reproducir">
                                        <b-icon icon="play"  ></b-icon>
                                    </b-button>
                                </div>
                            </template>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols="12" v-if="tablaCargada">
                    <b-pagination
                            :value="page"
                            :total-rows="totalRow"
                            :per-page="perPage"
                            limit="10"
                            first-number
                            last-number
                            align="fill"
                            size="sm"
                            class="my-0"
                            @change="paginationClick"
                    ></b-pagination>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    /* eslint-disable no-use-before-define */
    import axios from "axios";
    import {addQuery} from "@/Utils";
    import {mapActions, mapGetters} from "vuex";
    import SinAcceso from "@/components/random/SinAcceso";
    let audioActual = null

    export default {
        name: "ArchivoSelectorView",
        components: {
            SinAcceso
        },
        props: {
            propTipo: Number,
        },
        data(){
            return{
                cargando:false,
                totalRow:1000,
                perPage:10,
                sortBy:'',
                sortDesc:false,
                page:1,
                formBuscar:'',
                columnas:[
                    {key:'id', sortable:true},
                    {key:'path', sortable:true},
                    {key:'tipo', sortable:true, formatter:(value,key,item)=>item.tipoStr()},
                    {key:'created_at', sortable:true},
                    {key:'updated_at', sortable:true},
                    'accion'
                ],

            }
        },
        mounted() {
            this.cargarArchivosInterno()
            if(this.tablaCargada){
                this.totalRow = this.archivos.length
            }
        },
        destroyed() {
            this.pararFondoArchivo()
        },
        watch:{
            sortBy(){
                this.cargarArchivosInterno()
            },
            sortDesc(){
                this.cargarArchivosInterno()
            },
            page(){
                this.cargarArchivosInterno()
            },
        },
        computed:{
            ...mapGetters([
                'userName',
                'checkPermiso',
            ]),
            ...mapGetters({
                archivos: 'archivo_archivos',
                tablaCargada: 'archivo_cargado'
            }),
            titulo(){
                let titulo = 'Archivos'
                return titulo
            },
            permisoParaVer(){
                return this.checkPermiso('caja_lista_listar')
            }
        },
        methods:{
            ...mapActions({
                cargarArchivos: 'archivo_cargar',
                toggleEstadoArchivo: 'archivo_view_toggle_estado',
                editarArchivo: 'archivo_view_editar',
                reproducirFondoArchivo: 'archivo_view_reproducir_sonido',
                pararFondoArchivo: 'archivo_view_parar_sonido',
            }),
            cargarArchivosInterno(){
                this.cargarArchivos({
                    empresa_id:this.empresa_id,
                    params:{
                        perPage: this.perPage,
                        page: this.page,
                        nombre: this.formBuscar,
                        sortBy: this.sortBy,
                        sortDesc: this.sortDesc?'desc':'asc',
                        tipo: this.propTipo,
                        // with: ['fondo'],
                    }
                }).then(({response})=>{
                    this.totalRow = response.data.total
                    //todo: aldo: hacer esta comprobacion siempre
                    if(this.page > response.data.last_page){
                        this.paginationClick(response.data.last_page)
                    }
                })
            },
            paginationClick(page){
                if(page !== this.page){
                    this.page = page
                    // this.$router.push(addQuery(this.$route,{add:{archivo_page:page}}))
                }
            },
            buscarUsuarios(){
                this.cargarArchivosInterno()
                // this.$router.push(addQuery(this.$route,{add:{archivo_buscar:this.formBuscar}})).catch(()=>{})
            },
            archivoSeleccionado(archivo){
                this.$emit('seleccionado',archivo)
            }
        },
    }
</script>

<style scoped>

</style>