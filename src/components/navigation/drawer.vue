<template>
    <v-navigation-drawer 
        :mini-variant.sync="mini" 
        app 
        :permanent="$vuetify.breakpoint.smAndUp"
        mini-variant-width="70"
        expand-on-hover
        :temporary="!$vuetify.breakpoint.smAndUp"
    >
        <v-list-item class="px-2 py-8">
            <v-list-item-avatar tile v-if="mini">
                <v-img src="@/assets/logo-img.png" />
            </v-list-item-avatar>

            <v-list-item-title v-if="!mini">
                <v-img src="@/assets/logo-letters.png" contain/>
            </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item-group v-model="selected" mandatory color="primary"> 
                <v-list-item 
                    active-class="active" 
                    v-for="item in menu_items"
                    :key="item.text"
                    @click="goTo(item.route)"
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="font-weight-medium">
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Drawer',
    computed: {
        ...mapState({
            view: state => state.view.actual
        })
    },
    data() {
        return {
            mini: false,
            selected: null,
            menu_items: [{
                text: 'Inicio',
                icon: 'mdi-home-variant',
                route: 'Home'
            },{
                text: 'Invitaciones',
                icon: 'mdi-card-bulleted-outline',
                route: 'Invitations'
            },{
                text: 'Configuraciones',
                icon: 'mdi-cog',
                route: ''
            }]
        }
    },
    methods: {
        ...mapActions({
            goToView: 'view/goToView'
        }),
        goTo(route){
            this.goToView(route)
        }
    },
    watch: {
        view(){
            this.selected = this.menu_items.findIndex( i => i.route === this.view )
        }
    },
}
</script>

<style scoped>
</style>