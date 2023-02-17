<template>
    <div>
        <div ref="toPrint" class="v-application d-none">
            <div class="v-application--wrap">
                <div class="my-6">
                    <p class="text-h4 font-weight-medium text-center">Lista de Invitados </p>
                    <p class="text-h6 text-center">Boda {{bride.firstname}} & {{groom.firstname}}</p>
                </div>
                <v-card outlined flat>
                    <v-simple-table >
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th v-for="(header, index) in headers" :key="index" class="text-left font-weight-medium">
                                        {{ header }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(guest, index) in guests" :key="index">
                                    <td>{{ guest.name }}</td>
                                    <td>{{ guest.invitation }}</td>
                                    <td>{{ 
                                            guest.confirmed === null 
                                                ? 'Pendiente'
                                                : guest.confirmed ? 'Confirmada': 'Cancelada' 
                                        }}
                                    </td>
                                    <td>{{guest.type || 'GRUPAL'}}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
                </div>
            </div>
        <v-list-item @click="exportToPDF">
            <v-list-item-title>Descargar PDF</v-list-item-title>
        </v-list-item>
    </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import { mapState } from 'vuex'

export default {
    name: 'PrintPDF-Guests',
    computed: {
        ...mapState({
            bride: state => state.admin.configurations.bride,
            groom: state => state.admin.configurations.groom,
        })
    },
    props: ['guests', 'headers'],
    methods: {
        exportToPDF() {
            html2pdf(this.$refs.toPrint, {
                margin: 5,
                filename: 'Invitados.pdf'
            })
        },
    },
}
</script>
