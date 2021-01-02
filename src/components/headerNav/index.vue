<template>
    <header>
        <div>
            <b-navbar toggleable="lg" type="dark" variant="info">
                <b-navbar-brand href="#" @click.passive="$router.push('/')">Kamaleon Admin</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <router-link class="nav-link" to="/">Inicio <span class="sr-only">(current)</span></router-link>
<!--                        <router-link v-if="isAuthenticated" to="/puntos" class="nav-link">Puntos</router-link>-->
<!--                        <router-link v-if="isAuthenticated" to="/mapa" class="nav-link">Mapa</router-link>-->

                        <template v-if="isAuthenticated">
                            <template
                                    v-for="(menu,indexMenu) in getMenus"
                            >
                                <b-nav-item-dropdown :key="indexMenu" :text="menu.nombre" right>
                                    <b-dropdown-item
                                            href="#"
                                            :key="indexSubMenu"
                                            v-for="(menu,indexSubMenu) in menu.hijos"
                                            @click.prevent="clickMenu(menu.link)"
                                    >
                                        {{ menu.nombre }}
                                    </b-dropdown-item>
                                </b-nav-item-dropdown>
                            </template>
                        </template>
                    </b-navbar-nav>
                </b-collapse>
                <b-navbar-nav class="ml-auto" v-if="isAuthenticated">
                    <b-nav-item-dropdown v-if="isAuthenticated" right>
                        <template v-slot:button-content>
                            <em>{{ userName }}</em>
                        </template>
                        <b-dropdown-item href="#" @click.prevent="cerrarSesion">Cerrar Sesion</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
        </div>
    </header>
</template>

<script>
    import {AUTH_LOGOUT, AUTH_REQUEST} from "@/store/actions/auth";
    import {mapGetters} from "vuex";
    // eslint-disable-next-line no-unused-vars
    import axios from "axios";
    import {addQuery} from "@/Utils";

    export default {
        name: "header-nav",
        data() {
            return {
                email: "admin@usuarios.com.py",
                password: "adm1n",
            };
        },
        mounted() {
        },
        watch: {

        },
        methods: {
            login: function() {
                const { email, password } = this;
                this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
                    this.$router.push("/").catch(e=>{});
                });
            },
            cerrarSesion: function () {
                this.$store.dispatch(AUTH_LOGOUT)
                this.$router.push("/").catch(e=>{});
            },
            clickMenu(link){
                this.$router.push(addQuery(this.$route,{},link)).catch(()=>{})
            },
        },
        computed: {
            ...mapGetters([
                "isAuthenticated",
                "authStatus",
                "isAdmin",
                'userName',
                'getMenus',
            ]),
        },
    };
</script>
