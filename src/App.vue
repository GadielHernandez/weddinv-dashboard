<template>
    <v-app class="main">
        <drawer v-if="logged"/>

        <v-main>
            <router-view />
        </v-main>
        
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
import drawer from './components/navigation/drawer.vue'
export default {
    name: 'App',
    components: { drawer },
    computed: {
        ...mapState({
            logged: state => state.auth.logged
        })
    }
}
</script>

<style>
.h-100 {
    height: 100%;
}
.main{
    background-color: var(--v-background-base) !important;
}
.content-center{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>
