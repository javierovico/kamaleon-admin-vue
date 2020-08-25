<template>
    <div v-if="puntosMapa.length>0">
        <GmapMap
                :center="{lat:-25, lng:-56}"
                :zoom="7"
                map-type-id="terrain"
                style="width: 100%; height: 700px"
        >
            <GmapPolygon
                    :key="index"
                    v-for="(mapa,index) in puntosMapa"
                    :options="{fillColor:colorRandom(index)}"
                    :paths="mapa"
            />
        </GmapMap>
        <button @click="recargar()">Recargar</button>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "MapaPrueba",
        data(){
            return{
                puntosMapa:[]
            }
        },
        mounted(){
            this.recargar()
        },
        methods:{
            recargar(){
                axios.get('mapa-prueba').then(response=>{
                    this.puntosMapa = response.data
                })
            },
            colorRandom(index){
                return ['#E6331A', '#6680B3', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#FF6633', '#00E680',
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'][index]
            }
        }
    }
</script>

<style scoped>

</style>