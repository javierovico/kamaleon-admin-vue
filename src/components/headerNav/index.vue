<template>
    <header>
        <div>
            <b-navbar toggleable="lg" type="dark" variant="info">
                <b-navbar-brand href="#" @click.passive="$router.push('/')">Tupasy Tienda Admin</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <template v-if="isAuthenticated">
                            <a href="!#" @click.prevent="clickMenu('/')" class="nav-link" >Inicio</a>
                            <a href="!#" @click.prevent="clickMenu('/producto')" class="nav-link">Productos</a>
                        </template>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto" v-if="isAuthenticated">
                        <b-nav-item-dropdown :text="empresaSelected?empresaSelected.nombre:'Seleccione Empresa'" right>
                            <b-dropdown-item
                                    href="#"
                                    :key="empresa.id"
                                    v-for="(empresa) in empresas"
                                    @click="onClickEmpresa(empresa.id)"
                            >
                                {{empresa.nombre}}
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown right>
                            <template v-slot:button-content>
                                <em>{{ profile?profile.nombre:'cargando'}}</em>
                            </template>
                            <b-dropdown-item href="#" @click.prevent="cerrarSesion">Cerrar Sesion</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
    </header>
</template>

<script>
    import {AUTH_LOGOUT, AUTH_REQUEST} from "@/store/actions/auth";
    // eslint-disable-next-line no-unused-vars
    import axios from "axios";
    import {addQuery} from "@/Utils";
    import {mapGetters} from "vuex";

    export default {
        name: "header-nav",
        data() {
            return {
                email: "admin@usuarios.com.py",
                password: "adm1n",
                empresaSelected:null,
                empresas:[],
                empresa_id:null,
            };
        },
        mounted() {
            this.cargarEmpresaId(this.$route)
            this.cargarEmpresas()
        },
        watch: {
            $route(to, from) {
                if(to.query.empresa_id !== from.query.empresa_id){
                    this.cargarEmpresaId(to)
                }
            },
            empresa_id(){
                this.cargarEmpresaSelected()
            },
        },
        methods: {
            cargarEmpresaId(ruta){
                this.empresa_id = ruta.query.empresa_id?parseInt(ruta.query.empresa_id):null
            },
            onClickEmpresa(empresaID){
                this.$router.push(addQuery(this.$route,{add:{empresa_id:empresaID}})).catch(e=>{})
            },
            clickMenu(link){
                this.$router.push(addQuery(this.$route,{},link)).catch(e=>{})
            },
            login: function() {
                const { email, password } = this;
                this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
                    this.$router.push("/");
                });
            },
            cerrarSesion: function () {
                this.$store.dispatch(AUTH_LOGOUT)
                this.$router.push("/");
            },
            cargarEmpresas(){
                axios.get('/empresa',{params:{
                    perPage:100,
                }}).then((response)=>{
                    this.empresas = response.data.data;
                    if(this.empresas.length === 1){
                        this.onClickEmpresa(this.empresas[0].id)
                    }
                }).catch((error)=>{
                    console.log(error.response.data.message)
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            cargarEmpresaSelected(){
                this.empresaSelected = null;
                if(this.empresa_id == null){
                    return
                }
                axios.get(`/empresa/${this.empresa_id}`).then((response)=>{
                    this.empresaSelected = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                }).finally(()=>{
                    this.cargando = false;
                });
            },
        },
        computed: {
            ...mapGetters(["isAuthenticated", "authStatus", "isAdmin","profile"]),
        },
    };
</script>
