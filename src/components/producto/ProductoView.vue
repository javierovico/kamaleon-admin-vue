<template>
    <b-container fluid>
        <b-row>
            <template v-if="!!articulo">
                <b-col cols="12">
                    <h3>{{articulo.nombre}}</h3>
                </b-col>
                <b-col cols="12">
                    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
                        <b-form-group
                                id="input-group-1"
                                label="Nombre"
                                label-for="input-1"
                                description=""
                        >
                            <b-form-input
                                    id="input-1"
                                    v-model="articulo.nombre"
                                    type="text"
                                    required
                                    placeholder=""
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Descripcion" label-for="input-2">
                            <b-form-input
                                    id="input-2"
                                    v-model="articulo.descripcion"
                                    placeholder=""
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Precio">
                            <b-form-input
                                    v-model="articulo.precio"
                                    required
                                    placeholder=""
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Miniatura">

                            <!-- Styled -->
                            <b-form-file
                                    v-model="articulo.miniaturaAlzar"
                                    :state="Boolean(articulo.miniaturaAlzar)"
                                    @input="fileChange"
                                    placeholder="Seleccione una miniatura o arrastre"
                                    drop-placeholder="Suelta aca"
                                    accept="image/jpeg"
                            ></b-form-file>
                            <div class="mt-3">Selected file: {{ articulo.miniaturaAlzar ? articulo.miniaturaAlzar.name : '' }}</div>

                            <b-col>
                                <b-img
                                        thumbnail
                                        fluid
                                        :src="articulo.miniatura.url"
                                        alt="Image 1"
                                        width="400"
                                        height="400"
                                ></b-img>
                            </b-col>
                        </b-form-group>

<!--                        <b-form-group id="input-group-3" label="Food:" label-for="input-3">-->
<!--                            <b-form-select-->
<!--                                    id="input-3"-->
<!--                                    v-model="form.food"-->
<!--                                    :options="foods"-->
<!--                                    required-->
<!--                            ></b-form-select>-->
<!--                        </b-form-group>-->

<!--                        <b-form-group id="input-group-4">-->
<!--                            <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">-->
<!--                                <b-form-checkbox value="me">Check me out</b-form-checkbox>-->
<!--                                <b-form-checkbox value="that">Check that out</b-form-checkbox>-->
<!--                            </b-form-checkbox-group>-->
<!--                        </b-form-group>-->

                        <b-button type="submit" variant="primary">Guardar</b-button>
<!--                        <b-button type="reset" variant="danger">Reset</b-button>-->
                    </b-form>
                </b-col>
            </template>
            <template v-else>
                <b-col cols="12">
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Cargando...</strong>
                    </div>
                </b-col>
            </template>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import Articulo from "@/components/producto/Articulo";
    import {addQuery} from "@/Utils";
    export default {
        name: "ProductoView",
        props:[
            'empresa_id',
            'articulo_id',
        ],
        data(){
            return {
                articulo:null,
            }
        },
        mounted(){
            this.cargarArticulos()
        },
        methods:{
            abrirProducto(id){
                this.$router.push(addQuery(this.$route,{},`/producto/${id}`)).catch(e=>{})
            },
            cargarArticulos(){
                axios.get(`empresa/${this.empresa_id}/articulo/${this.articulo_id}?XDEBUG_SESSION_START=PHPSTORM`)
                    .then(response=>{
                        this.articulo = Articulo.fromSource(response.data.data)
                    })
                    .catch(error=>{
                        console.log(error)
                        this.$bvToast.toast(`Error: ${error.response.data.message}`, {
                            title: 'Articulo',
                            autoHideDelay: 5000,
                            appendToast: false,
                            variant: 'danger',
                        })
                    })
                    .finally(()=>{
                        this.cargando = false
                    })
            },
            fileChange(e){
                console.log(e)
                this.articulo.miniatura.url = URL.createObjectURL(e);
            },
            onSubmit(){
                console.log(this.articulo)
                let formData = new FormData();
                formData.append("photo", this.articulo.miniaturaAlzar);
                formData.append('_method','put')
                axios
                    .post(`empresa/${this.empresa_id}/articulo/${this.articulo_id}?XDEBUG_SESSION_START=PHPSTORM`,formData)
                    .then(response=>{})
                    .catch(error=>{
                        console.log(error)
                        this.$bvToast.toast(`Error: ${error.response.data.message}`, {
                            title: 'Articulo',
                            autoHideDelay: 5000,
                            appendToast: false,
                            variant: 'danger',
                        })
                    })
                    .finally(()=>{
                        this.cargando = false
                    })
            },
            onReset(){

            },
        },
    }
</script>

<style scoped>

</style>