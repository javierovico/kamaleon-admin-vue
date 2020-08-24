/** * Created by vouill on 11/13/17. */

<template>
  <div>
    <loading v-if="loading" />
    <div class="container" v-if="isAuthenticated">
      <template v-if="isAdmin">
        <h2>Usuarios Actuales</h2>
        <div class="row">
          <feed-item v-for="(feed, index) in usuarios" :key="index" :usuario="feed" />
        </div>
        <vue-fab mainBtnColor="#3599DB">
          <fab-item @clickItem="clickItem" :idx="0" title="Agregar Usuario" icon="add" />
        </vue-fab>
      </template>
      <template v-else>
        <span>Bienvenido</span>
      </template>
    </div>
    <div v-if="!isAuthenticated && authStatus !== 'loading'">
      <h1>Inicio de sesion</h1>
      <p>
        Administrador de Delivery
      </p>
      <login />
    </div>
  </div>
</template>

<style>
.home {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>

<script>
import FeedItem from "./feedItem.vue";
import { mapGetters } from "vuex";
import Login from "@/components/login";
import axios from 'axios';

export default {
  components: {
    Login,
    FeedItem
  },
  name: "home",
  computed: {
    ...mapGetters(["isAuthenticated", "authStatus","isAdmin"]),
    loading: function() {
      return this.authStatus === "loading" && !this.isAuthenticated;
    }
  },
  mounted(){
    this.isAuthenticated && this.isAdmin && this.leer()
  },
  data() {
    return {
      paginaActual: 1,
      paginaTotal: 1,
      paginaCantidadItem:20,
      usuarios: [],
    };
  },
  watch:{
    isAuthenticated: function () {
      this.isAdmin && this.leer()
    },
    isAdmin: function () {
      this.isAdmin && this.leer()
    }
  },
  methods:{
    leer(){
      let parametroBusqueda = {
        page: this.paginaActual,
        cantidad: this.paginaCantidadItem,
      };
      axios.get('/user',{params:parametroBusqueda}).then((response) => {
        this.usuarios = response.data.data;
        this.paginaTotal = response.data.last_page;
      }).catch((error)=>{
        console.log(error);
        alert(error.toString());
      });
    },
    clickItem(){
      this.$router.push('/usuario/agregar')
    }
  }
};
</script>
