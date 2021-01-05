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
        },
        mounted(){
            this.cargarPanoInterno()
        },
        computed:{
            ...mapGetters({
                pano: 'pano_pano_by_id',
            })
        },
        watch:{
            pano(p){
                if(p){
                    this.cargarVisor()
                }else{
                    window.removepano("panoId1");
                }
            }
        },
        methods:{
            ...mapActions({
                cargarPano: 'pano_pano_by_id',
            }),
            cargarPanoInterno(){
                this.cargarPano({
                    id:this.propPanoId
                })
            },
            cargarVisor(){
                window.removepano("panoId1");
                window.embedpano({
                    xml:process.env.BASE_URL+`public/krpano/plugins/plantilla.xml`,
                    id:'panoId1',
                    target:"pano1",
                    vars:{
                        "idunico":"nose",
                        "autorot":'false',
                        "editar":'false',
                        "llamada":'no',
                        panos: [this.pano],
                        raizArchivos: process.env.VUE_APP_URL_S3,
                    },
                    initvars:{
                        'URLKRPANO': `/public/krpano`,
                        'ROOT_URL' : `/public`,
                        'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
                    },
                    onready: this.cargado1,
                    consolelog:true
                });
            }
        }
    }
</script>

<style scoped>

</style>