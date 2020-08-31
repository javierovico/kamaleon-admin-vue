<template>
  <div id="app">
    <HeaderNav/>
    <div class="container">
      <div class="col-md-12">
        <router-view></router-view>
      </div>
    </div>
    <br><br><br><br><br><br>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  // eslint-disable-next-line no-unused-vars
  import {USER_REQUEST} from "@/store/actions/user";
  import Home from "@/components/home/index";
  import HeaderNav from "@/components/headerNav";
  // import axios from "axios";

  export default {
    name: 'App',
    components: {
      HeaderNav,
      // eslint-disable-next-line vue/no-unused-components
      Home,
      // eslint-disable-next-line vue/no-unused-components
      HelloWorld
    },
    data(){
      return{
        deliverySelected:null,
        sucursalSelected:null
      }
    },
    mounted() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST);
      }
      // axios.get('/auth/user');
    },
    methods:{
      deliverySelectedChange(del){
        this.deliverySelected = del
      },
      sucursalSelectedChange(suc){
        this.sucursalSelected = suc
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
