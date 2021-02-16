<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h1>Cargando....</h1>
            </b-col>
            <b-col cols="12">
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando...</strong>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: "Cargando"
}
</script>

<style scoped>

</style>