<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col cols="12">
                    <div :id="propIdDiv" style="height:600px;"></div>
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
            propId: Object,
            propPanoId:Number,      //el pano que se va estar mostrando
            propIdDiv:String,       //el nombre del id de la div
            // propPanoId: Number,
            // propTourId: Number,
        },
        data(){
            return {
                pano1: null,
            }
        },
        mounted(){
            this.cargarDatosVisor()
            this.cargarVisor()
        },
        computed:{
            // ...mapGetters({
            //     visorCargado: 'visor_cargado',
            //     visorTitulo: 'visor_titulo',
            //     visorPanos: 'visor_panos',
            //     visorTourSpots: 'visor_tourSpots',
            // }),
            visorCargado(){
                return this.$store.getters.visor_cargado(this.propIdDiv)
            },
        },
        watch:{
            propId(){
                this.cargarDatosVisor()
            },
            propPanoId(p){
                if(p){
                    this.visorCambiarPano({pano_id:p,idVisor:this.propIdDiv})
                }
            },
            visorCargado(v){
                if(v){
                    this.visorActualizar({idVisor:this.propIdDiv})
                }else{
                    this.visorLimpiarPantalla({idVisor:this.propIdDiv})
                }
            },
        },
        methods:{
            ...mapActions({
                visorCargarByTourId: 'visor_cargar_by_tour_id',
                visorCargarByPanoId: 'visor_cargar_by_pano_id',
                visorRestablecer: 'visor_restablecer',
                visorInicializar: 'visor_crear_instancia',
                visorActualizar: 'visor_actualizar_pantalla',
                visorLimpiarPantalla: 'visor_limpiar_pantalla',
                visorCambiarPano: 'visor_cambiar_pano',
            }),
            cargarDatosVisor(){
                if(this.propId.tourIdVisor){
                    this.visorCargarByTourId({
                        id:this.propId.tourIdVisor,
                        idVisor:this.propIdDiv
                    })
                }else if(this.propId.panoIdVisor){
                    this.visorCargarByPanoId({
                        id:this.propId.panoIdVisor,
                        idVisor:this.propIdDiv
                    })
                }else{
                    this.visorRestablecer({idVisor:this.propIdDiv})
                }
            },
            cargarVisor(){
                this.visorInicializar({idVisor:this.propIdDiv})
                // window.removepano("panoId1");
            }
        }
    }
</script>

<style scoped>

</style>