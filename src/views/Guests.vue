<template>
    <div class="main">
        <div class="pa-3 pa-md-6 pt-0 pt-md-0">
            <v-toolbar flat class="title">
                <h4 class="title text-h5 my-0 font-weight-bold">Invitados</h4>
            </v-toolbar>

            <information />

            <v-toolbar class="my-4 pa-0" flat dense>
                <v-btn small color="primary">
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
                            :headers="['Nombre', 'Invitacion', 'Asistencia']"
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
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import information from '../components/guests/informationGuests.vue'
import printPDF from '../components/guests/printPDF.vue'
import generateCSV from '../plugins/generateCSV'

export default {
    name: 'Guests',
    components: { information, printPDF },
    computed: {
        ...mapState({
            guests: (state) => {
                const guests = []

                state.admin.list.forEach((invitation) => {
                    if (!invitation.guests) return
                    invitation.guests.forEach((guest) => {
                        guests.push({
                            invitation: invitation.name,
                            name: guest.name,
                            confirmed: guest.confirmed,
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
            ],
            htmlToPrint: null,
            search: [],
            list_guests: [],
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
        downloadPDF(){
            this.htmlToPrint = this.$refs.table
        },
        downloadCSVData() {
            let CSV = ''

            const headers = 'Nombre ,Invitacion ,Asistencia \n'
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
                CSV += '\n'
            })
            
            generateCSV(CSV, 'Invitados.csv')
        }
    },
    mounted() {
        this.setView('Guests')
        this.filterGuests()
        this.htmlToPrint = this.$refs.table
    },
}
</script>

<style scoped>
.no-guests {
    min-height: 50vh;
}
</style>
