<template>
    <v-navigation-drawer 
        :mini-variant.sync="mini" 
        app 
        :permanent="$vuetify.breakpoint.smAndUp"
        mini-variant-width="50"
        :temporary="!$vuetify.breakpoint.smAndUp"
        clipped
        width="115"
    >

        <v-list nav class="pa-0 options">
            <v-list-item-group v-model="selected" mandatory color="primary"> 
                <v-list-item 
                    active-class="active" 
                    v-for="item in menu_items"
                    :key="item.text"
                    @click="goTo(item.route)"
                    class="ma-0"
                >
                    <v-list-item-icon v-if="mini">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content v-if="!mini" class="text-center">
                        <v-icon>{{ item.icon }}</v-icon>
                        <p class="mb-0"> {{ item.text }} </p>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>

        <template v-slot:append>
            <v-divider></v-divider>
            <div class="text-center pb-3 pt-1">
                <v-btn x-small icon>
                    <v-icon v-if="mini" @click="mini = false">
                        mdi-page-last
                    </v-icon>
                    <v-icon v-else  @click="mini = true">
                        mdi-page-first
                    </v-icon>
                </v-btn>
            </div>
        </template>
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
            mini: true,
            selected: null,
            menu_items: [{
                text: 'Inicio',
                icon: 'mdi-home-outline',
                route: 'Home'
            },{
                text: 'Invitados',
                icon: 'mdi-account-supervisor-outline',
                route: 'Invitations'
            },{
                text: 'Invitaciòn',
                icon: 'mdi-card-bulleted-outline',
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
.options{
    font-size: 13px !important;
}
</style>