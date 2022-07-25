<template>
    <v-app-bar
        outlined
        color="background"
        flat
        class="px-0 py-3 navbar"
        height="unset"
    >
        <slot name="title" />
        
        <v-spacer></v-spacer>

        <v-menu
            :close-on-content-click="false"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" 
                    fab 
                    small
                    color="primary"
                    depressed
                >
                    <v-icon>
                        mdi-account-outline
                    </v-icon>
                </v-btn>
            </template>

            <v-card width="300">
                <v-card-text>
                    <v-list-item>
                        <v-list-item-avatar color="primary">
                            <v-icon dark>
                                mdi-account
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ email }}</v-list-item-title>
                            <v-list-item-subtitle>{{ wedding }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-text>
                <v-divider></v-divider>
                <v-list dense nav>
                    <v-list-item @click="tryLogout">
                        <v-list-item-content>
                            <v-list-item-title>Cerrar sesión</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-list-item-icon>
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
            wedding: state => state.admin.configurations.uid
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
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>