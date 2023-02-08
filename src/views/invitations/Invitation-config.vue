<template>
    <div class="pa-3 pa-md-6 pt-0 pt-md-0" v-if="configurations">
        <v-btn
                small
                icon
                @click="$router.push({name: 'Invitations'})"
                color="primary"
            >
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        <v-toolbar flat class="title">
            <h4 class="title text-h5 my-0 font-weight-bold">Editar Invitación</h4>
            <v-spacer></v-spacer>
            <v-btn
                small
                :href="`https://${configurations.uid}.web.app/watch`"
                target="_blank"
                color="primary"
            >
                Ver invitacion
            </v-btn>
        </v-toolbar>

        <v-card outlined class="mt-3">
            <v-toolbar flat dense>
                <p class="my-0 font-weight-bold text-caption">Secciones</p>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list>
                <template v-for="(section, index) in sections">
                    <v-list-item :key="section.id" class="py-2">
                        <v-list-item-avatar
                            :color="section.ready === true ? 'success' : 'light'"
                            size="40"
                        >
                            <v-icon dark v-if="section.ready">
                                mdi-check
                            </v-icon>
                            <v-icon v-else>
                                mdi-exclamation
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="font-weight-medium">
                            {{ section.name }}
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn color="secondary" small text outlined @click="editSection(section)">
                                Editar
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider :key="index" v-if="index !== sections.length -1"></v-divider>
                </template>
            </v-list>
        </v-card>
        <v-dialog v-model="editing.status" max-width="600" persistent>
            <v-card v-if="editing.section">
                <component :is="editing.section.id" @close="closeEdit" :editing="editing.status"></component>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import layout from '../../components/invitation/layout.vue'
import parents from '../../components/invitation/parents.vue'
import locations from '../../components/invitation/locations.vue'
import dresscode from '../../components/invitation/dresscode.vue'
import gifts from '../../components/invitation/gifts.vue'
import gallery from '../../components/invitation/gallery.vue'
import attendance from '../../components/invitation/attendance.vue'
export default {
    name: 'Invitation',
    components: { layout, parents, locations, dresscode, gifts, gallery, attendance },
    computed: {
        ...mapState({
            configurations: (state) => state.admin.configurations,
            sections: (state) => {
                const sections = [
                    {
                        id: 'attendance',
                        name: 'Configuraciones'
                    },
                    {
                        id: 'layout',
                        name: 'Seccion inicial',
                    },
                    {
                        id: 'parents',
                        name: 'Seccion padres',
                    },
                    {
                        id: 'locations',
                        name: 'Locaciones',
                    },
                    {
                        id: 'dresscode',
                        name: 'Código de vestimenta',
                    },
                    {
                        id: 'gifts',
                        name: 'Regalos',
                    },
                    {
                        id: 'gallery',
                        name: 'Galeria',
                    },
                ]
                sections.forEach((section) => {
                    if (state.admin.configurations[section.id])
                        section.ready = true
                })
                return sections
            },
        }),
    },
    data() {
        return {
            editing: {
                status: false,
                section: null
            }
        }
    },
    methods: {
        ...mapActions({
            setView: 'view/setView',
        }),
        editSection(section){
            this.editing.section = section
            this.editing.status = true
        },
        closeEdit(){
            this.editing.section = null
            this.editing.status = false
        }
    },
    mounted() {
        this.setView('Invitation')
    },
}
</script>

<style></style>
