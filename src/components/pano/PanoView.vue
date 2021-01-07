<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col cols="12">
                    <div id="pano1" style="height:600px;"></div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    export default {
        name: "PanoView",
        props:{
            propPanoId: Number,
            propTourId: Number,
        },
        data(){
            return {
                pano1: null,
            }
        },
        mounted(){
            this.cargarPanoInterno()
        },
        computed:{
            ...mapGetters({
                pano: 'pano_pano_by_id',
                tour: 'tour_tour_by_id',
                panos: 'pano_panos',
                tourSpots: 'tourSpot_tourSpots',
                tourSpotsCargado: 'tourSpot_cargado',
            }),
            panosInterno(){
                if(this.propTourId && this.panos.length > 0){
                    return this.panos
                }else if(this.propPanoId && this.pano){
                    return [this.pano]
                }else{
                    return []
                }
            },
            tituloVisor(){
                if(this.tour){
                    return this.tour.nombre
                }else if(this.panosInterno.length > 0){
                    return this.panosInterno[0].nombre
                }else{
                    return `Sin Titulo`
                }
            }
        },
        watch:{
            propPanoId(){
                this.cargarPanoInterno()
            },
            propTourId(){
                this.cargarPanoInterno()
            },
            panosInterno(p){
                if(p.length > 0 && (!this.propTourId || this.tourSpotsCargado)){
                    this.cargarVisor()
                }else{
                    window.removepano("panoId1");
                }
            },
            tour(t){
                if(t){
                    this.cargarPanoInterno()
                    this.cargarTourSpotInterno()
                }
            },
            pano(p){
                if(p){
                    this.cargarVisor()
                }
            },
            tourSpots(ts){
                if(ts && this.panosInterno.length > 0){
                    this.cargarVisor()
                }
            },
        },
        methods:{
            ...mapActions({
                cargarPano: 'pano_pano_by_id',
                cargarTour: 'tour_tour_by_id',
                cargarPanos: 'pano_cargar_by_tour',
                cargarTourSpot: 'tourSpot_cargar_by_tour',
            }),
            cargarPanoInterno(){
                if(this.tour){
                    this.cargarPanos({
                        tour:this.tour,
                    })
                }else if(this.propPanoId){
                    this.cargarPano({
                        id:this.propPanoId
                    })
                }else if(this.propTourId){
                    this.cargarTour({
                        id:this.propTourId,
                    })
                }
            },
            cargarTourSpotInterno(){
                this.cargarTourSpot({
                    tour:this.tour
                })
            },
            cargarVisor(){
                // window.removepano("panoId1");
                window.embedpano({
                    xml:process.env.BASE_URL+`public/krpano/plugins/plantilla.xml`,
                    id:'panoId1',
                    target:"pano1",
                    vars:{
                        "idunico":"nose",
                        "autorot":'false',
                        "editar": false,
                        "llamada":'no',
                        panos: this.panosInterno,
                        raizArchivos: process.env.VUE_APP_URL_S3,
                        tituloPanorama: this.tituloVisor,
                        tourSpots: this.tourSpots,
                    },
                    initvars:{
                        'URLKRPANO': `/public/krpano`,
                        'ROOT_URL' : `/public`,
                        'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
                    },
                    onready: (p)=>{
                        this.pano1 = p
                    },
                    consolelog:true
                });
            }
        }
    }
</script>

<style scoped>

</style>