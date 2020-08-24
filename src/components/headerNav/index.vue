<template>
  <header>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#" @click.passive="$router.push('/')">Kamaleon Admin</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <router-link class="nav-link" to="/">Inicio <span class="sr-only">(current)</span></router-link>
            <router-link v-if="isAuthenticated" to="/puntos" class="nav-link">Puntos</router-link>
            <router-link v-if="isAuthenticated" to="/mapa" class="nav-link">Mapa</router-link>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </header>
</template>

<script>
  import {AUTH_LOGOUT, AUTH_REQUEST} from "@/store/actions/auth";
import {mapGetters} from "vuex";
  // eslint-disable-next-line no-unused-vars
  import axios from "axios";

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
        this.$router.push("/");
      });
    },
    cerrarSesion: function () {
      this.$store.dispatch(AUTH_LOGOUT)
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "authStatus", "isAdmin"]),
  },
};
</script>
