<template>
    <div class="main">
        <div class="pa-3 pa-md-6 pt-0 pt-md-0">
            <v-toolbar flat class="title">
                <h4 class="title text-h5 my-0 font-weight-bold">Invitados</h4>
            </v-toolbar>

            <information />

            <v-toolbar class="my-4 pa-0" flat dense>
                <v-btn small color="primary" @click="openInvitationForm()">
                    Añadir Invitado
                </v-btn>
                <v-spacer></v-spacer>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            outlined
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                        >
                            Descargar <v-icon>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <printPDF 
                            :guests="list_guests" 
                            :headers="['Nombre', 'Invitacion', 'Asistencia', 'Tipo']"
                        />
                        <v-divider></v-divider>
                        <v-list-item @click="downloadCSVData">
                            <v-list-item-title
                                >Descargar Excel</v-list-item-title
                            >
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>
            
            <v-card class="rounded-lg" outlined ref="table">
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-select
                        v-model="search"
                        :items="[
                            {
                                text: 'Confirmados',
                                value: true,
                            },
                            {
                                text: 'Cancelados',
                                value: false,
                            },
                            {
                                text: 'Pendientes',
                                value: null,
                            },
                        ]"
                        label="Estatus"
                        multiple
                        dense
                        solo
                        flat
                        outlined
                        chips
                        hide-details
                        @input="filterGuests"
                    ></v-select>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- eslint-disable -->
                <v-data-table
                    v-if="guests && guests.length > 0"
                    :headers="headers"
                    :items="list_guests"
                    @click:row="openInvitationForm"
                >
                    <template v-slot:item.name="{ item }">
                        <div>
                            <v-list-item>
                                <v-list-item-avatar
                                    color="primary"
                                    class="d-none d-sm-flex"
                                >
                                    <v-icon dark>mdi-account</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title
                                        class="font-weight-medium"
                                    >
                                        {{ item.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle
                                        style="font-size: 12px"
                                    >
                                        {{ item.invitation }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </div>
                    </template>
                    <template v-slot:item.confirmed="{ item }">
                        <v-chip small outlined v-if="item.confirmed === null">
                            Pediente
                        </v-chip>
                        <v-chip
                            small
                            outlined
                            color="success"
                            v-else-if="item.confirmed"
                        >
                            Confirmado
                        </v-chip>
                        <v-chip
                            small
                            outlined
                            color="warning"
                            v-else="item.confirmed"
                        >
                            Cancelado
                        </v-chip>
                    </template>
                    <template v-slot:item.type="{ item }">
                        <span class="text-caption">
                            {{item.type === TYPES.PERSONAL ? 'PERSONAL': 'GRUPAL'}}
                        </span>
                    </template>
                </v-data-table>
                <!-- eslint-enable -->
                <v-card-text v-else class="no-guests text-center d-flex">
                    <div class="ma-auto">
                        <v-icon large>
                            mdi-card-bulleted-settings-outline
                        </v-icon>
                        <p>No hay invitados registrados</p>
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <formInvitation 
            :open="invitation_form.open"
            :invitation="invitation_form.invitation"
            @close="closeInvitationForm"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import information from '../components/guests/informationGuests.vue'
import printPDF from '../components/guests/printPDF.vue'
import generateCSV from '../plugins/generateCSV'
import TYPES from '../plugins/invitations-types'
import formInvitation from '../components/formGuest.vue'

export default {
    name: 'Guests',
    components: { information, printPDF, formInvitation },
    computed: {
        ...mapState({
            invitations: (state) => state.admin.list,
            guests: (state) => {
                const guests = []

                state.admin.list.forEach((invitation) => {
                    if (!invitation.guests) return
                    invitation.guests.forEach((guest, index) => {
                        let inv_name
                        if(invitation.type === TYPES.PERSONAL){
                            inv_name = index === 0 ? 'Personal' : `AC: ${invitation.name}`
                        }else
                            inv_name = invitation.name
                        
                        guests.push({
                            id_invitation: invitation.id,
                            invitation: inv_name,
                            name: guest.name,
                            confirmed: guest.confirmed,
                            type: invitation.type
                        })
                    })
                })

                return guests
            },
        }),
    },
    data() {
        return {
            headers: [
                { text: 'Nombre', value: 'name' },
                { text: 'Asistencia', value: 'confirmed', align: 'center' },
                { text: 'Invitación', value: 'type', align: 'center' },
            ],
            search: [],
            list_guests: [],
            TYPES: TYPES,
            invitation_form: {
                open: false,
                invitation: {
                    id: null,
                    name: '',
                    phone: '',
                    guests: null,
                    type: null,
                    confirmed: false
                }
            }
        }
    },
    methods: {
        ...mapActions({
            setView: 'view/setView',
        }),
        filterGuests() {
            this.list_guests = this.guests.filter(
                (guest) =>
                    this.search.length === 0 ||
                    this.search.includes(guest.confirmed)
            )
        },
        downloadCSVData() {
            let CSV = ''

            const headers = 'Nombre ,Invitacion, Tipo ,Asistencia,  \n'
            CSV += headers

            this.list_guests.forEach((guest) => {
                CSV += `${guest.name} ,`
                CSV += `${guest.invitation} ,`
                CSV +=
                    guest.confirmed === null
                        ? 'Pendiente ,'
                        : guest.confirmed
                        ? 'Confirmada ,'
                        : 'Cancelada ,'
                CSV += guest.type || 'GRUPAL'
                CSV += '\n'
            })
            
            generateCSV(CSV, 'Invitados.csv')
        },
        openInvitationForm(invitation) {
            if (!invitation || !invitation.id_invitation) return this.invitation_form.open = true
            
            const index = this.invitations.findIndex((g) => g.id === invitation.id_invitation)
            this.invitation_form.invitation.id = invitation.id_invitation
            this.invitation_form.invitation.name = this.invitations[index].name
            this.invitation_form.invitation.guests = this.invitations[index].guests
            this.invitation_form.invitation.phone = this.invitations[index].phone
            this.invitation_form.invitation.type = this.invitations[index].type
            this.invitation_form.invitation.confirmed = this.invitations[index].confirm === true
            this.invitation_form.open = true
        },
        closeInvitationForm() {
            this.invitation_form.invitation.id = null
            this.invitation_form.invitation.name = ''
            this.invitation_form.invitation.guests = null
            this.invitation_form.invitation.phone = ''
            this.invitation_form.invitation.type = null
            this.invitation_form.invitation.confirmed = false
            this.invitation_form.open = false
        },
    },
    mounted() {
        this.setView('Guests')
        this.filterGuests()
    },
}
</script>

<style scoped>
.no-guests {
    min-height: 50vh;
}
</style>
