<template>
    <v-app-bar
        app
        color="background"
        flat
        class="navbar"
        height="50"
        clipped-left
    >
        <v-img src="@/assets/logo-img.png" height="30" max-width="30" contain/>
        <v-img src="@/assets/logo-letters.png" max-width="115" contain class="ml-3"/>
        
        <v-spacer></v-spacer>

        <v-menu
            :close-on-content-click="false"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" 
                    fab 
                    x-small
                    color="primary"
                    depressed
                >
                    <v-icon small>
                        mdi-account
                    </v-icon>
                </v-btn>
            </template>

            <v-card width="300">
                <v-card-text class="text-center">
                    <p>
                        <v-list-item-avatar color="primary">
                            <v-icon dark>
                                mdi-account
                            </v-icon>
                        </v-list-item-avatar>
                    </p>
                    <p class="mb-0 font-weight-bold">{{ wedding }}.web.app</p>
                    <p>{{ email }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-list dense nav>
                    <v-list-item @click="tryLogout">
                        <v-list-item-content>
                            <v-list-item-title>Cerrar sesión</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'navbar',
    props: ['height'],
    computed: {
        ...mapState({
            email: state => state.auth.user && state.auth.user.email,
            wedding: state => state.admin.configurations ? state.admin.configurations.uid: null
        })
    },
    methods: {
        ...mapActions({
            logout: 'auth/logout',
            goTo: 'view/goToView'
        }),
        async tryLogout(){
            await this.logout()
            this.goTo('Login')
        }
    },
}
</script>

<style>
header.navbar > div{
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>