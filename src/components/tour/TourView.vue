<template>
    <div>
        <SinAcceso v-if="!permisoParaVer"/>
        <b-container fluid v-else>
            <b-row class="justify-content-md-center">
                <b-col cols="12" class="pt-5">
                    <div>
                        <b-navbar type="light" variant="light" toggleable="lg">
                            <b-navbar-brand><h3>{{tituloPanorama}}</h3></b-navbar-brand>
                            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                            <b-collapse id="nav-collapse" is-nav>
                                <b-navbar-nav class="ml-auto">
                                    <b-nav-form @submit.prevent="buscarUsuarios()">
                                        <b-form-input v-model="formBuscar" class="mr-sm-2" placeholder="Usuario..."></b-form-input>
                                        <b-button variant="outline-success" class="my-2 my-sm-0" type="submit">Buscar</b-button>
                                    </b-nav-form>
                                    <b-nav-form class="ml-3">
                                        <b-button @click.prevent="abrirPanoramaSelector()" variant="info" class="my-2 my-sm-0" type="submit">
                                            <b-icon icon="plus" aria-hidden="true"></b-icon>
                                            Asignar Panorama
                                        </b-button>
                                    </b-nav-form>
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
                            :no-local-sorting="false"
                            responsive
                            striped hover
                            show-empty
                            :busy="!tour" :items="panos" :fields="columnas">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template #cell(fondo_id)="data">
                            <template v-if="data.item.fondo && data.item.fondo._reproduciendo">
                                <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="pararArchivoSonido()" v-b-tooltip.hover title="Parar">
                                    <b-icon icon="stop"  ></b-icon>
                                </b-button>
                            </template>
                            <template v-else-if="data.value">
                                <div class="h2 mb-0">
                                    <b-button variant="outline-danger" size="sm" class="mb-2" @click.prevent="eliminarFondoPano({pano:data.item})" v-b-tooltip.hover title="Eliminar">
                                        <b-icon font-scale="1" :icon="data.item.activo?'x-circle':'check-circle'" ></b-icon>
                                    </b-button>
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="reproducirArchivoSonido({archivo:data.item.fondo})" v-b-tooltip.hover title="Reproducir">
                                        <b-icon icon="play"  ></b-icon>
                                    </b-button>
                                </div>
                            </template>
                            <template v-else>
                                <div class="h2 mb-0">
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="agregarArchivo(data.item)" v-b-tooltip.hover title="Agregar">
                                        <b-icon icon="plus"  ></b-icon>
                                    </b-button>
                                </div>
                            </template>
                        </template>
                        <template #cell(accion)="data">
                            <template>
                                <div class="h2 mb-0">
                                    <b-button v-b-tooltip.hover title="Desasignar" variant="outline-danger" size="sm" class="mb-2" @click.prevent="desasignarTourInterno(data.item)">
                                        <b-icon font-scale="1" icon="trash" ></b-icon>
                                    </b-button>
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="editarTour({tour:data.item})">
                                        <b-icon icon="pencil"  ></b-icon>
                                    </b-button>
                                    <b-button v-b-tooltip.hover title="Ver Panorama" size="sm" variant="outline-info" class="mb-2" @click.prevent="verPanorama(data.item)">
                                        <b-icon icon="eye"  ></b-icon>
                                    </b-button>
                                </div>
                            </template>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols="12" v-if="panos && panos.length > perPage">
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
        <PanoView
                :prop-id="panoId"
                :prop-pano-id="panoVisor"
                prop-id-div="id-tour-view"
        />
        <b-modal id="modal-seleccion-archivo"
                 title="Sonido de fondo"
                 size="xl"
                 :no-enforce-focus="true"
        >
            <ArchivoSelectorView
                :propTipo="tipo"
                @seleccionado="archivoSeleccionado($event,panoSeleccionFondo)"
            />
        </b-modal>
        <b-modal id="modal-seleccion-panorama"
                 title="Seleccion Panorama"
                 size="xl"
                 :no-enforce-focus="true"
        >
            <PanoramaSelector
                    :propTipo="tipo"
                    @seleccionado="panoramaSeleccionado($event,tourSeleccionadoPanorama)"
            />
        </b-modal>
    </div>
</template>

<script>
    /* eslint-disable no-use-before-define */
    import axios from "axios";
    import {addQuery} from "@/Utils";
    import {mapActions, mapGetters} from "vuex";
    import SinAcceso from "@/components/random/SinAcceso";
    import ArchivoSelectorView from "@/components/archivo/ArchivoSelectorView";
    import Archivo from "@/store/modelos/Archivo";
    import PanoView from "@/components/pano/PanoView";
    import PanoramaSelector from "@/components/archivo/PanoramaSelectorView";
    let audioActual = null

    export default {
        name: "TourView",
        components: {
            PanoramaSelector,
            PanoView,
            ArchivoSelectorView,
            SinAcceso
        },
        props: {
            propTourId: Number,
            propSortBy: String,
            propSortDesc: Boolean,
            propPage: Number,
            propBuscar: String,
            propMotivoId: Number,
            propMotivoSumbotivoBuscarNombre: String,
            propMotivoSubMotivoPage: Number,
            propMotivoSubMotivoSortBy: String,
            propMotivoSubMotivoSortDesc: Boolean,
        },
        data(){
            return{
                // tourIdVisor: null,
                // panoIdVisor: null,
                panoId:{
                    tourIdVisor: null,
                    panoIdVisor: null,
                },
                panoVisor:null, //el pano que se esta viendo (el seleccionado)
                tipo:Archivo.TIPO_SONIDO,
                cargando:false,
                totalRow:1000,
                perPage:15,
                sortBy:'',
                sortDesc:false,
                page:1,
                formBuscar:'',
                panoSeleccionFondo:null,        //guarda el tour que se va agregar fondo
                tourSeleccionadoPanorama:null,        //guarda el tour que se va agregar panorama
                columnas:[
                    {key:'id', sortable:true},
                    {key:'nombre', sortable:true},
                    {key:'gps_lat'},
                    {key:'gps_lng'},
                    {key:'created_at', sortable:true},
                    {key:'updated_at', sortable:true},
                    {key:'fondo_id', sortable:true},
                    'accion'
                ],

            }
        },
        mounted() {
            this.loadParametros()
            this.cargarTourInterno()
            this.cargarPanosInterno()

            // if(this.propMotivoId){
            //     this.$bvModal.show('modal-motivo-submotivo')
            // }
            // if(this.tablaCargada){
            //     this.totalRow = this.tours.length
            // }
        },
        destroyed() {
            this.pararArchivoSonido()
        },
        watch:{
            propPage(){
                this.cargarTourInterno()
            },
            propSortDesc(){
                this.cargarTourInterno()
            },
            propSortBy(){
                this.cargarTourInterno()
            },
            propBuscar(){
                this.cargarTourInterno()
            },
            tour(){
                this.cargarPanosInterno()
            }
        },
        computed:{
            ...mapGetters([
                'userName',
                'checkPermiso',
            ]),
            ...mapGetters({
                tour: 'tour_tour_by_id',
                panos: 'pano_panos',
                tablaCargada: 'tour_cargado'
            }),
            // panos(){
            //     return this.tour?this.tour.panos:[]
            // },
            titulo(){
                let titulo = `Tour ${this.propTourId}`
                return titulo
            },
            tituloPanorama(){
                let titulo = `Panoramas`
                if(this.tour){
                    titulo += ` de ${this.tour.nombre} (${this.panos.length} en total)`
                }
                return titulo
            },
            permisoParaVer(){
                return this.checkPermiso('caja_lista_listar')
            }
        },
        methods:{
            ...mapActions({
                cargarTour: 'tour_tour_by_id',
                cargarPanos: 'pano_cargar_by_tour',
                cargarPanosByTourId: 'pano_cargar_by_tour_id',
                toggleEstadoTour: 'tour_view_toggle_estado',
                editarTour: 'tour_view_editar',
                reproducirArchivoSonido: 'archivo_view_reproducir_sonido',
                pararArchivoSonido: 'archivo_view_parar_sonido',
                asignarSonidoPano: 'pano_asignar_fondo',
                eliminarFondoTour: 'tour_eliminar_fondo',
                eliminarFondoPano: 'pano_eliminar_fondo',
                asignarPanorama: 'tour_asignar_panorama'
            }),
            loadParametros(){
                this.page = this.propPage
                this.sortBy = this.propSortBy
                this.sortDesc = this.propSortDesc
                this.formBuscar = this.propBuscar

                this.panoId = {
                    panoIdVisor : null,
                    tourIdVisor : this.propTourId,
                }
                // setTimeout(()=>{
                //     this.panoId = {
                //         panoIdVisor : null,
                //         tourIdVisor : this.propTourId,
                //     }
                // }, 6000);
            },
            cargarTourInterno(){
                this.cargarTour({id:this.propTourId})
            },
            cargarPanosInterno(){
                // this.cargarPanos({
                //     tour:this.tour,
                //     params:{
                //         with:['fondo'],
                //     }
                // })
                this.cargarPanosByTourId({
                    id: this.propTourId,
                    params:{
                        with:['fondo'],
                    }
                })
            },
            paginationClick(page){
                if(page !== this.page){
                    this.page = page
                    // this.$router.push(addQuery(this.$route,{add:{tour_page:page}}))
                }
            },
            buscarUsuarios(){
                this.$router.push(addQuery(this.$route,{add:{tour_buscar:this.formBuscar}})).catch(()=>{})
            },
            agregarArchivo(pano){
                this.panoSeleccionFondo = pano
                this.$bvModal.show('modal-seleccion-archivo')
            },
            archivoSeleccionado(archivo,pano){
                this.asignarSonidoPano({archivo,pano})
                this.$bvModal.hide('modal-seleccion-archivo')
            },
            verPanorama(pano){
                this.panoVisor = pano.id
                // this.$router.push(addQuery(this.$route,{},`/pano/${pano.id}/visor`))
                // this.panoId = {
                //     panoIdVisor : pano.id,
                //     tourIdVisor : null,
                // }
            },
            abrirPanoramaSelector(){
                if(this.tour){
                    this.tourSeleccionadoPanorama = this.tour
                    this.$bvModal.show('modal-seleccion-panorama')
                }
            },
            panoramaSeleccionado(pano,tour){
                this.asignarPanorama({tour,pano})
                this.$bvModal.hide('modal-seleccion-panorama')
            },
            desasignarTourInterno(pano){
                this.$store.dispatch('tour_desasignar_panorama',{tour:this.tour,pano})
            },
        },
    }
</script>

<style scoped>

</style>