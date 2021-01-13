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
                                        <b-form-input v-model="formBuscar" class="mr-sm-2" placeholder="Panorama..."></b-form-input>
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
                            :busy="!tablaCargada" :items="panos" :fields="columnas">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template #cell(activo)="data">
                            <h4><b-badge href="!#" @click.prevent="toggleEstadoArchivo({pano:data.item})" :variant="data.value?'success':'danger'">{{ data.value?'SI':'NO' }}</b-badge></h4>
                        </template>
                        <template #cell(accion)="data">
                            <template v-if="data.item._reproduciendo">  <!-- Si es que esta reproduciendo -->
                                <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="pararFondoArchivo()" v-b-tooltip.hover title="Parar">
                                    <b-icon icon="stop"  ></b-icon>
                                </b-button>
                            </template>
                            <template v-else>  <!-- Si es que No esta reproduciendo -->
                                <div class="h2 mb-0">
                                    <b-button variant="outline-success" size="sm" class="mb-2" @click.prevent="panoSeleccionado(data.item)" v-b-tooltip.hover title="Seleccionar">
                                        <b-icon font-scale="1" icon="check-circle" ></b-icon>
                                    </b-button>
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="abrirModalPano(data.item)" v-b-tooltip.hover title="Ver">
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
        <b-modal id="modal-seleccion-panorama"
                 title="Visor Pano"
                 size="xl"
                 :no-enforce-focus="true"
        >
            <PanoView
                    :prop-id="panoId"
                    prop-id-div="tours-id-view-modal1"
            />
        </b-modal>
    </div>
</template>

<script>
    /* eslint-disable no-use-before-define */
    import {mapActions, mapGetters} from "vuex";
    import SinAcceso from "@/components/random/SinAcceso";
    import PanoView from "@/components/pano/PanoView";


    export default {
        name: "PanoramaSelector",
        components: {
            PanoView,
            SinAcceso
        },
        props: {
            propTipo: Number,
        },
        data(){
            return{
                panoId:{
                    tourIdVisor: null,
                    panoIdVisor: null,
                },
                panos:[],
                cargando:false,
                totalRow:1000,
                perPage:10,
                sortBy:'',
                sortDesc:false,
                page:1,
                formBuscar:'',
                columnas:[
                    {key:'id', sortable:true},
                    {key:'nombre',sortable: true},
                    // {key:'path', sortable:true},
                    // {key:'tipo', sortable:true, formatter:(value,key,item)=>item.tipoStr()},
                    {key:'created_at', sortable:true},
                    {key:'updated_at', sortable:true},
                    'accion'
                ],

            }
        },
        mounted() {
            this.cargarPanosInterno()
            if(this.tablaCargada){
                this.totalRow = this.panos.length
            }
        },
        destroyed() {
            // this.pararFondoArchivo()
        },
        watch:{
            sortBy(){
                this.cargarPanosInterno()
            },
            sortDesc(){
                this.cargarPanosInterno()
            },
            page(){
                this.cargarPanosInterno()
            },
        },
        computed:{
            ...mapGetters([
                'userName',
                'checkPermiso',
            ]),
            ...mapGetters({
                // panos: 'pano_panos',
                tablaCargada: 'pano_cargado'
            }),
            titulo(){
                return 'Panoramas'
            },
            permisoParaVer(){
                return true
            }
        },
        methods:{
            ...mapActions({
                cargarPanos: 'pano_cargar',
                toggleEstadoArchivo: 'pano_view_toggle_estado',
                editarArchivo: 'pano_view_editar',
            }),
            cargarPanosInterno(){
                this.cargarPanos({
                    soloRetornar:true,
                    params:{
                        perPage: this.perPage,
                        page: this.page,
                        nombre: this.formBuscar,
                        sortBy: this.sortBy,
                        sortDesc: this.sortDesc?'desc':'asc',
                        tipo: this.propTipo,
                        // with: ['fondo'],
                    }
                }).then(({response,panos})=>{
                    this.panos = panos
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
                    // this.$router.push(addQuery(this.$route,{add:{pano_page:page}}))
                }
            },
            buscarUsuarios(){
                this.cargarPanosInterno()
                // this.$router.push(addQuery(this.$route,{add:{pano_buscar:this.formBuscar}})).catch(()=>{})
            },
            panoSeleccionado(pano){
                this.$emit('seleccionado',pano)
            },
            abrirModalPano(pano){
                this.panoId = {
                    tourIdVisor: null,
                    panoIdVisor: pano.id,
                }
                this.$bvModal.show('modal-seleccion-panorama')
            },
        },
    }
</script>

<style scoped>

</style>