<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col cols="12">
                    <h2>Panoramas</h2>
                </b-col>
                <b-col cols="12">
                    <b-table
                            :no-local-sorting="true"
                            show-empty
                            :busy="cargando" head-variant="dark" small striped hover :items="panos" :fields="panosFields">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template v-slot:cell(acciones)="data">
                            <div>
                                <b-button size="sm" variant="primary" class="mb-2" @click="abrirPano(data.item,pano1)">
                                    <b-icon icon="eye" aria-label="Help"></b-icon>
                                </b-button>
                                <b-button size="sm" variant="primary" class="mb-2" @click="abrirPano(data.item,pano2)">
                                    <b-icon icon="eye" aria-label="Help"></b-icon>
                                </b-button>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols="6">
                    <div id="pano1" style="height:300px;"></div>
                </b-col>
                <b-col cols="6">
                    <div id="pano2" style="height:300px;"></div>
                </b-col>
                <b-col cols="12">
                    <button @click="crearHotspot">Crear Hotspot</button>
                    <button @click="quitarHotspot">Quitar Hotspot</button>
                    <button @click="crearHotspotImagen">Crear Hotspot de Imagen</button>
                    <button @click="crearHotspotInfo">Crear Hotspot de Info</button>
                </b-col>
            </b-row>
            <b-row cols="12">

                <GmapMap
                        ref="mapRef"
                        :center="centro"
                        :zoom="7"
                        map-type-id="satellite"
                        style="width:100%;height: 700px"
                >
                    <template>
                        <GmapMarker ref="myMarker"
                                    :position="google && new google.maps.LatLng(1.38, 103.8)" />
                    </template>
                    <template
                            v-for="(m, index) in panosPosition"
                    >
                        <GmapMarker
                                :key="index"
                                :position="m.position"
                                :clickable="true"
                                :draggable="true"
                                @click="center=m.position"
                        />
                    </template>
                </GmapMap>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import axios from "axios";
    import Pano from "@/components/panos/Pano";
    // eslint-disable-next-line no-unused-vars
    import {URL, URL_WEB} from "@/Utils";
    import {gmapApi} from 'vue2-google-maps'
    // eslint-disable-next-line no-unused-vars
    import * as VueGoogleMaps from "vue2-google-maps";

    // import Krpano from "vue-krpano";
    // import * as myKrpano from "@/krpano.js"
    // import Krpano from "vue-krpano";

    export default {
        name: "panos",
        props:['tourId'],
        watch:{
            tourId(){
                this.loadPanos()
                this.loadTour()
                this.centerMap()
            }
        },
        computed: {
            google: gmapApi,
            panosPosition(){ return this.panos.filter(p=>p.hasPosition())},
        },
        data(){
            return {
                centro:{lat:-25, lng:-56},
                panos:[],
                panosFields:[
                    {key:'id'},
                    {key:'nombre'},
                    {key:'zoom'},
                    {key:'gps', formatter:(value,item,key)=>(key.gps_lat && key.gps_lng)?'si':'no'},
                    {key:'pano_destino_count', label:'Conexiones'},
                    {key:'acciones'},
                ],
                cargando:false,
                currentPage:1,
                perPage:100,
                totalRows:1,
                pano1:null,
                pano2:null,
            }
        },
        mounted(){
            this.loadPanos()
            this.loadTour()
            this.centerMap()
        },
        methods:{
            loadPanos(){
                axios.get(`/tour/${this.tourId}/panos`,{params:{
                    perPage: this.perPage,
                    page: this.currentPage,
                }}).then(response=>{
                    this.panos.splice(0,this.panos.length)
                    response.data.data.forEach(data=>{
                        this.panos.push(Pano.fromSource(data))
                    })
                    this.puntoTotalRows = response.data.total
                })
            },
            init(){
                console.log('initi')
            },
            loadTour(){
                // window.embedpano({
                //     xml:`${URL}/tour/${this.tourId}/xml`,
                //     target:"pano"
                // });
                window.removepano("panoId1");
                window.removepano("panoId2");
                window.embedpano({
                    xml:`${URL}/tour/${this.tourId}/xml?editar=true`,
                    id:'panoId1',
                    target:"pano1",
                    vars:{
                        "idunico":"nose",
                        "autorot":'false',
                        "editar":'true',
                        "llamada":'no',
                    },
                    initvars:{
                        'URLKRPANO': `/public/krpano`,
                        'ROOT_URL' : `/public`,
                        'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
                    },
                    onready: this.cargado1,
                    consolelog:true
                });
                window.embedpano({
                    xml:`${URL}/tour/${this.tourId}/xml?editar=true`,
                    id:'panoId2',
                    target:"pano2",
                    vars:{
                        "idunico":"nose",
                        "autorot":'false',
                        "editar":'true',
                        "llamada":'no',
                    },
                    initvars:{
                        'URLKRPANO': `/public/krpano`,
                        'ROOT_URL' : `/public`,
                        'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
                    },
                    onready: this.cargado2,
                    consolelog:true
                });
            },
            abrirPano(pano,pantalla){
                pantalla.call("loadscene('pano"+pano.id+"')")
            },
            cargado1(car){
                this.pano1 = car
            },
            cargado2(car){
                this.pano2 = car
            },
            quitarHotspot(){
                const fuenteId = parseInt(this.pano1.get('xml.scene').toString().substr(4))
                const destinoId = parseInt(this.pano2.get('xml.scene').toString().substr(4))
                if(fuenteId === destinoId){
                    alert('no pueden ser el mismo')
                    return
                }
                axios.post(`/tour/${this.tourId}/remHotspot`,{
                    fuente: fuenteId,
                    destino: destinoId,
                }).then(()=>{
                    this.loadTour()
                }).catch((error)=>{
                    alert('error')
                    console.log(error.response)
                })
            },
            crearHotspotImagen(){
                const fuenteId = parseInt(this.pano1.get('xml.scene').toString().substr(4))
                const en_h = this.pano1.get('view.hlookat')
                const en_v = this.pano1.get('view.vlookat')
                const nombre = prompt('Nombre','abrir');
                const icono_id = prompt('Icono Id','1');
                const imagen_id = prompt('Imagen Id','1');
                const sonido_id = prompt('Sonido Id','');
                axios.post(`/tour/${this.tourId}/addHotspotImagen?XDEBUG_SESSION_START=PHPSTORM`,{
                    fuente: fuenteId,
                    en_h: en_h,
                    en_v: en_v,
                    icono_id: icono_id,
                    imagen_id: imagen_id,
                    sonido_id: sonido_id,
                    nombre:nombre
                }).then(()=>{
                    // this.loadTour()
                    console.log('hotspot craedo')
                }).catch((error)=>{
                    alert('error')
                    console.log(error.response)
                })
            },
            crearHotspotInfo(){
                const fuenteId = parseInt(this.pano1.get('xml.scene').toString().substr(4))
                const en_h = this.pano1.get('view.hlookat')
                const en_v = this.pano1.get('view.vlookat')
                const titulo = prompt('Titulo','');
                const informacion = prompt('Informacion','');
                axios.post(`/tour/${this.tourId}/addHotspotInfo?XDEBUG_SESSION_START=PHPSTORM`,{
                    fuente: fuenteId,
                    en_h: en_h,
                    en_v: en_v,
                    titulo: titulo,
                    informacion: informacion
                }).then(()=>{
                    // this.loadTour()
                    console.log('hotspot craedo')
                }).catch((error)=>{
                    alert('error')
                    console.log(error.response)
                })
            },
            crearHotspot(){
                const fuenteId = parseInt(this.pano1.get('xml.scene').toString().substr(4))
                const destinoId = parseInt(this.pano2.get('xml.scene').toString().substr(4))
                const en_h = this.pano1.get('view.hlookat')
                const en_v = this.pano1.get('view.vlookat')
                const a_h = this.pano2.get('view.hlookat')
                const a_v = this.pano2.get('view.vlookat')
                if(fuenteId === destinoId){
                    alert('no pueden ser el mismo')
                    return
                }
                console.log(en_h,en_v,a_h,a_v,fuenteId,destinoId)
                axios.post(`/tour/${this.tourId}/addHotspot?XDEBUG_SESSION_START=PHPSTORM`,{
                    fuente: fuenteId,
                    destino: destinoId,
                    en_h: en_h,
                    en_v: en_v,
                    a_h: a_h,
                    a_v: a_v,
                }).then(()=>{
                    this.loadTour()
                }).catch((error)=>{
                    alert('error')
                    console.log(error.response)
                })
            },
            centerMap(){
                // console.log('center')
                // const bounds = new this.google.maps.LatLngBounds()
                // this.panosPosition.forEach(p=>{
                //     bounds.extend(p.position)
                // })
                // console.log(bounds)
                // this.$refs.mapRef.$mapPromise.then((map) => {
                //     map.fitBounds(bounds)
                // })
            },
        },
    }
</script>

<style scoped>

</style>