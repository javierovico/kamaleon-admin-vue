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
                            :busy="!panosCargado" :items="panos" :fields="columnas">
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
                                    <b-button v-b-tooltip.hover title="Ver en visor1" size="sm" variant="outline-info" class="mb-2" @click.prevent="verPanorama(data.item,instanciaVisor1.id)">
                                        <b-icon icon="eye"  ></b-icon>
                                    </b-button>
                                    <b-button v-b-tooltip.hover title="Ver en visor2" size="sm" variant="outline-info" class="mb-2" @click.prevent="verPanorama(data.item,instanciaVisor2.id)">
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
                <b-col cols="12">
                    <b-form-checkbox v-model="modoEditHotspot" name="check-button" switch size="lg">
                        Modo Hotspot: <b>{{ modoEditHotspot?'Activo':'Inactivo' }}</b>
                    </b-form-checkbox>
                </b-col>
            </b-row>
        </b-container>
        <PanoView
                :prop-id="panoId"
                :prop-pano-id="instanciaVisor1.panoId"
                :prop-id-div="instanciaVisor1.id"
                :prop-h="instanciaVisor1.h"
                :prop-v="instanciaVisor1.v"
                @panoClick="panoClick"
                @viewChange="viewChange($event,instanciaVisor1.id)"
                @panoChange="panoChange($event,instanciaVisor1.id)"
                @errorChange="errorChange"
        />
        h:{{instanciaVisor1.h}} v: h:{{instanciaVisor1.v}}
        <template v-if="modoEditHotspot">
            <PanoView
                    :prop-id="panoId"
                    :prop-pano-id="instanciaVisor2.panoId"
                    :prop-id-div="instanciaVisor2.id"
                    :prop-h="instanciaVisor2.h"
                    :prop-v="instanciaVisor2.v"
                    @panoClick="panoClick"
                    @viewChange="viewChange($event,instanciaVisor2.id)"
                    @panoChange="panoChange($event,instanciaVisor2.id)"
            />
            h:{{instanciaVisor2.h}} v: h:{{instanciaVisor2.v}}
            <button @click="crearHotspotInterno">Crear Hotspot</button>
            <button @click="borrarHotspotInterno">Borrar Hotspot</button>
        </template>
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
        <!--    Para seleccionar panorama de destino    -->
        <b-modal id="modal-seleccion-panorama-destino"
                 title="Seleccion Panorama Destino Hotspot"
                 size="xl"
                 :no-enforce-focus="true"
        >
            <PanoramaSelector
                    :propTipo="tipo"
                    @seleccionado="panoramaSeleccionadoHotspot(spotConfig.panoFuente,$event,spotConfig.tour,spotConfig.h,spotConfig.v)"
            />
        </b-modal>
    </div>
</template>

<script>
    /* eslint-disable no-use-before-define */
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
                modoEditHotspot:true,
                visores:[
                    {
                        id:'id-tour-view',
                        h:50.0,
                        v:0.0,
                        panoId:null,
                    },
                    {
                        id:'id-tour-view-2',
                        h:0.0,
                        v:15.0,
                        panoId:240,
                    }
                ],
                spotConfig: {
                    panoFuente:null,
                    tour:null,
                    h:null,
                    v:null,
                },
                panoId:{
                    tourIdVisor: null,
                    panoIdVisor: null,
                },
                // panoVisor:null, //el pano que se esta viendo (el seleccionado)
                // panoVisor2:null, //el pano que se esta viendo (el seleccionado en la segunda pantalla)
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
                // tour: 'tour_tour_by_id',
                // panos: 'pano_panos',
                tablaCargada: 'tour_cargado'
            }),
            instanciaVisor1(){
                return this.visores.find(v=>v.id==='id-tour-view')
            },
            instanciaVisor2(){
                return this.visores.find(v=>v.id==='id-tour-view-2')
            },
            tour(){
                return this.$store.getters.tour_tour_by_id(this.propTourId)
            },
            panos(){
                return this.$store.getters.pano_panos_by_tour_id(this.propTourId)
            },
            panosCargado(){
                return this.$store.getters.pano_cargado_by_tour_id(this.propTourId)
            },
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
            verPanorama(pano,visor){
                const instancia = this.visores.find(v=>v.id===visor)
                instancia.panoId = pano.id
                // if(visor===1){
                //     this.panoVisor = pano.id
                // }else if(visor===2){
                //     this.panoVisor2 = pano.id
                // }

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
            panoClick(panoId,h,v){
                // eslint-disable-next-line no-constant-condition
                if(this.tour && this.modoEditHotspot && false){
                    this.spotConfig.panoFuente = this.panos.find(p => p.id === panoId)
                    this.spotConfig.tour = this.tour
                    this.spotConfig.h = h
                    this.spotConfig.v = v
                    this.$bvModal.show('modal-seleccion-panorama-destino')
                }
            },
            panoramaSeleccionadoHotspot(panoFuente,panoDestino,tour,h,v){
                this.$store.dispatch('tour_asignar_spot',{tour,panoFuente,panoDestino,h,v})
                this.$bvModal.hide('modal-seleccion-panorama-destino')
            },
            borrarHotspotInterno(){
                const {tour} = this
                const panoFuente = this.$store.getters.pano_find_by_id(this.instanciaVisor1.panoId)
                const panoDestino = this.$store.getters.pano_find_by_id(this.instanciaVisor2.panoId)
                this.$store.dispatch('tour_desasignar_spot',{tour,panoFuente,panoDestino})
            },
            crearHotspotInterno(){
                const {tour} = this
                const panoFuente = this.$store.getters.pano_find_by_id(this.instanciaVisor1.panoId)
                const panoDestino = this.$store.getters.pano_find_by_id(this.instanciaVisor2.panoId)
                if(panoFuente.id === panoDestino.id){
                    this.$store.dispatch('general_error',`Pano fuente no puede ser igual a pano Destino`)
                    return
                }
                const en_h = this.instanciaVisor1.h
                const en_v = this.instanciaVisor1.v
                const a_h = this.instanciaVisor2.h
                const a_v = this.instanciaVisor2.v
                this.$store.dispatch('tour_asignar_spot',{tour,panoFuente,panoDestino,en_h,en_v,a_h,a_v})
            },
            viewChange({panoId, h, v},idVisor){
                const instancia = this.visores.find(v=>v.id===idVisor)
                instancia.h = h
                instancia.v = v
            },
            panoChange(panoId,idVisor){
                const instancia = this.visores.find(v=>v.id===idVisor)
                instancia.panoId = panoId
            },
            errorChange(error){//hotspot[pano4_img] - loading of 'https://s3.us-east-2.amazonaws.com/kamaleon360.panos/akati/akati_6/thumbnail_hotspot.png' failed!
                if(/^hotspot\[pano[0-9]+_img] - loading of '.*' failed!$/i.test(error)){
                    let panoId = error.substr(12)
                    panoId = parseInt(panoId.substring(0,panoId.indexOf('_img] - loading of')))
                    let pano = this.$store.getters.pano_find_by_id(panoId)
                    this.$store.dispatch('pano_crear_thumb',{pano})
                }
            }
        },
    }
</script>

<style scoped>

</style>