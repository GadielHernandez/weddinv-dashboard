<template>
    <v-app class="main">
        <navbar v-if="logged">
            <template v-slot:title>
                <div>
                    
                </div>
            </template>
        </navbar>
        <v-divider v-if="logged"></v-divider>
        <drawer v-if="logged"/>

        <v-main>
            <v-container fluid v-if="logged">
                <router-view></router-view>
            </v-container>
            <router-view v-else></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
import drawer from './components/navigation/drawer.vue'
import navbar from './components/navigation/navbar.vue'
export default {
    name: 'App',
    components: { drawer, navbar },
    computed: {
        ...mapState({
            logged: (state) => state.auth.logged,
        }),
    },
}
</script>

<style>
.h-100 {
    height: 100%;
}
.main {
    background-color: var(--v-background-base) !important;
}
.content-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
header.title > div{
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>
