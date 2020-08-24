/** * Created by vouill on 11/13/17. */

<template>
  <div class="card col-12 col-sm-7 col-md-5 col-lg-4" >
    <div class="card-body">
      <h5 class="card-title">{{usuario.name}}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{usuario.email}}</h6>
      <p class="card-text">{{usuario.content}}</p>
      <router-link :to="'/usuario/editar/'+usuario.id" class="card-link">Editar</router-link>
      <router-link :to="'/usuario/eliminar/'+usuario.id" class="card-link">Eliminar</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "feedItem",
  props: { usuario: Object }
};
</script>
