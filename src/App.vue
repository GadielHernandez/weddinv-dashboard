<template>
    <v-app class="main">
        <drawer />

        <v-main>
            <router-view />
        </v-main>
        
    </v-app>
</template>

<script>
import drawer from './components/navigation/drawer.vue'
export default {
    name: 'App',
    components: { drawer }
}
</script>

<style>
.h-100 {
    height: 100%;
}
.main{
    background-color: var(--v-background-base) !important;
}
</style>
