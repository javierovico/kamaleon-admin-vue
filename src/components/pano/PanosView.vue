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
                                        <b-form-input v-model="formBuscar" class="mr-sm-2" placeholder="Usuario..."></b-form-input>
                                        <b-button variant="outline-success" class="my-2 my-sm-0" type="submit">Buscar</b-button>
                                    </b-nav-form>
                                    <b-nav-form class="ml-3">
                                        <b-button @click.prevent="crearPanoInterno()" variant="info" class="my-2 my-sm-0" type="submit">
                                            <b-icon icon="plus" aria-hidden="true"></b-icon>
                                            Crear Panorama
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
                            <h4><b-badge href="!#" @click.prevent="toggleEstadoTour({tour:data.item})" :variant="data.value?'success':'danger'">{{ data.value?'SI':'NO' }}</b-badge></h4>
                        </template>
                        <template #cell(fondo_id)="data">
                            <template v-if="data.item._reproduciendo">
                                <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="pararFondoTour()" v-b-tooltip.hover title="Parar">
                                    <b-icon icon="stop"  ></b-icon>
                                </b-button>
                            </template>
                            <template v-else-if="data.value">
                                <div class="h2 mb-0">
                                    <b-button variant="outline-danger" size="sm" class="mb-2" @click.prevent="eliminarFondoTour({tour:data.item})" v-b-tooltip.hover title="Eliminar">
                                        <b-icon font-scale="1" :icon="data.item.activo?'x-circle':'check-circle'" ></b-icon>
                                    </b-button>
                                    <b-button size="sm" variant="outline-info" class="mb-2" @click.prevent="reproducirFondoTour({tour:data.item})" v-b-tooltip.hover title="Reproducir">
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
                                    <b-button v-b-tooltip.hover :title="data.item.activo?'Desactivar':'Activar'" :variant="'outline-'+(data.item.activo?'danger':'success')" size="sm" class="mb-2" @click.prevent="toggleEstadoTour({tour:data.item})">
                                        <b-icon font-scale="1" :icon="data.item.activo?'x-circle':'check-circle'" ></b-icon>
                                    </b-button>
                                    <b-button v-b-tooltip.hover title="Editar" size="sm" variant="outline-info" class="mb-2" @click.prevent="editarTour({tour:data.item})">
                                        <b-icon icon="pencil"  ></b-icon>
                                    </b-button>
                                    <b-button v-b-tooltip.hover title="Ver Detalles" size="sm" variant="outline-info" class="mb-2" @click.prevent="abrirTour(data.item)">
                                        <b-icon icon="eye"  ></b-icon>
                                    </b-button>
                                    <b-button v-b-tooltip.hover title="Ver en el Visor" size="sm" variant="outline-info" class="mb-2" @click.prevent="verVisor(data.item)">
                                        <b-icon icon="eye"  ></b-icon>
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

        <PanoView
                :prop-id="panoId"
                prop-id-div="tours-id-view"
        />

        <b-modal id="modal-tour-archivo"
                 title="Sonido de fondo"
                 size="xl"
                 :no-enforce-focus="true"
        >
            <ArchivoSelectorView
                :propTipo="tipo"
                @seleccionado="archivoSeleccionado($event,tourSeleccionFondo)"
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
    let audioActual = null

    export default {
        name: "PanosView",
        components: {
            PanoView,
            ArchivoSelectorView,
            SinAcceso
        },
        props: {
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
                panoId:{
                    tourIdVisor: null,
                    panoIdVisor: null,
                },
                tipo:Archivo.TIPO_SONIDO,
                cargando:false,
                // totalRow:1000,
                perPage:5,
                sortBy:'',
                sortDesc:false,
                page:1,
                formBuscar:'',
                tourSeleccionFondo:null,        //guarda el tour que se va agregar fondo
                columnas:[
                    {key:'id', sortable:true},
                    {key:'nombre', sortable:true},
                    {key:'activo', sortable:true},
                    {key:'panos_count', sortable:true,label:'N. Panos'},
                    {key:'created_at', sortable:true},
                    {key:'updated_at', sortable:true},
                    {key:'fondo_id', sortable:true},
                    'accion'
                ],

            }
        },
        mounted() {
            this.loadParametros()
            this.cargarPanosInterno()
            if(this.propMotivoId){
                this.$bvModal.show('modal-motivo-submotivo')
            }
            // if(this.tablaCargada){
            //     this.totalRow = this.panos.length
            // }
        },
        destroyed() {
            this.pararFondoTour()
        },
        watch:{
            propMotivoId(e){
                if(e){
                    this.$bvModal.show('modal-motivo-submotivo')
                }else{
                    this.$bvModal.hide('modal-motivo-submotivo')
                }
            },
            sortBy(){
                this.$router.push(addQuery(this.$route,{add:{tour_sort_by:this.sortBy}})).catch(()=>{})
            },
            sortDesc(){
                this.$router.push(addQuery(this.$route,{add:{tour_sort_desc:this.sortDesc}})).catch(()=>{})
            },
            propPage(){
                this.cargarPanosInterno()
            },
            propSortDesc(){
                this.cargarPanosInterno()
            },
            propSortBy(){
                this.cargarPanosInterno()
            },
            propBuscar(){
                this.cargarPanosInterno()
            },
            lastPage(lp){
                //todo: aldo: hacer esta comprobacion siempre
                if(this.page > lp){
                    this.paginationClick(lp)
                }
            },
            // formBuscar(b){
            //     this.$router.push(addQuery(this.$route,{add:{tour_buscar:b}})).catch(()=>{})
            // },
        },
        computed:{
            ...mapGetters([
                'userName',
                'checkPermiso',
            ]),
            ...mapGetters({
                // panos: 'tour_panos',
                tablaCargada: 'tour_cargado'
            }),
            totalRow(){
                return this.$store.getters.pano_total(this.instanciaPano)
            },
            lastPage(){
                return this.$store.getters.pano_last_page(this.instanciaPano)
            },
            params(){
                return {
                    perPage: this.perPage,
                    page: this.propPage,
                    nombre: this.propBuscar,
                    sortBy: this.propSortBy,
                    sortDesc: this.propSortDesc?'desc':'asc',
                }
            },
            instanciaPano(){
                return 'panos-view-'+JSON.stringify(this.params)
            },
            panos(){
                return this.$store.getters.pano_panos(this.instanciaPano)
            },
            titulo(){
                let titulo = 'Panos'
                return titulo
            },
            permisoParaVer(){
                return this.checkPermiso('caja_lista_listar')
            }
        },
        methods:{
            ...mapActions({
                cargarPanos: 'pano_cargar',
                toggleEstadoTour: 'tour_view_toggle_estado',
                editarTour: 'tour_view_editar',
                crearTour: 'tour_view_crear_nuevo',
                reproducirFondoTour: 'tour_view_reproducir_sonido',
                pararFondoTour: 'tour_view_parar_sonido',
                asignarFondoTour: 'tour_asignar_fondo',
                eliminarFondoTour: 'tour_eliminar_fondo',
                crearPano: 'pano_view_crear_pano',
            }),
            loadParametros(){
                this.page = this.propPage
                this.sortBy = this.propSortBy
                this.sortDesc = this.propSortDesc
                this.formBuscar = this.propBuscar
            },
            cargarPanosInterno(){
                this.cargarPanos({
                    idInstancia:this.instanciaPano,
                    params:this.params,
                })
                // .then(({response})=>{
                //     this.totalRow = response.data.total
                //     //todo: aldo: hacer esta comprobacion siempre
                //     if(this.page > response.data.last_page){
                //         this.paginationClick(response.data.last_page)
                //     }
                // })
            },
            paginationClick(page){
                if(page !== this.page){
                    this.page = page
                    this.$router.push(addQuery(this.$route,{add:{tour_page:page}}))
                }
            },
            buscarUsuarios(){
                this.$router.push(addQuery(this.$route,{add:{tour_buscar:this.formBuscar}})).catch(()=>{})
            },
            agregarArchivo(tour){
                this.tourSeleccionFondo = tour
                this.$bvModal.show('modal-tour-archivo')
            },
            archivoSeleccionado(archivo,tour){
                this.asignarFondoTour({archivo,tour})
                this.$bvModal.hide('modal-tour-archivo')
            },
            verVisor(pano){
                // this.$router.push(addQuery(this.$route,{},`/tour/${tour.id}/visor`))
                this.panoId = {
                    panoIdVisor : pano.id,
                    tourIdVisor : null,
                }
            },
            abrirTour(tour){
                this.$router.push(addQuery(this.$route,{},`/tour/${tour.id}`))
            },
            crearTourInterno(){
                this.crearTour()
            },
            crearPanoInterno(){
                this.crearPano().then(()=>{
                    this.cargarPanosInterno()
                })
            }
        },
    }
</script>

<style scoped>

</style>