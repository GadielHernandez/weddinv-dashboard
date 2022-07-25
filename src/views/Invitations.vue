<template>
    <div class="main">
        <div v-if="!loading && ready" class="pa-3 pa-md-6">
            <Navbar :height="'100px'" class="mb-6">
                <template v-slot:title>
                    <div>
                        <h4 class="title text-h4 my-0 font-weight-bold">Invitados</h4>
                    </div>
                </template>
            </Navbar>

            <information class="mb-6"/>

            <v-card class="rounded-lg" outlined>
                <v-toolbar flat>
                    <v-text-field
                        v-model="search"
                        label="Buscar"
                        append-icon="mdi-magnify"
                        dense
                        flat
                        solo
                        outlined
                        hide-details
                        @input="filter_status = null"
                    />
                    <v-select
                        v-model="filter_status"
                        :items="['Sin responder', 'No asistire', 'Asistire']"
                        label="Filtro"
                        dense
                        flat
                        solo
                        outlined
                        hide-details
                        class="ml-1"
                        style="font-size: 12px; max-width: 150px;"
                        
                        clearable
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="px-3"
                        color="primary"
                        dark
                        @click="openDialog()"
                        style="min-width: unset"
                    >
                        <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- eslint-disable -->
                <v-data-table
                    v-if="guests && guests.length > 0"
                    :headers="[
                        { text: '', value: 'name' },
                        { text: 'Invitados', value: 'guests', align: 'center', sortable: false },
                        { text: 'Estatus', value: 'status', align: 'center', sortable: false },
                        { text: 'Link', value: 'link' },
                        { text: 'Opciones', value: 'actions', sortable: false },
                    ]"
                    :items="guests"
                    :search="search ? search : filter_status"
                >
                    <template v-slot:item.name="{ item }">
                        <div>
                            <v-list-item>
                                <v-list-item-avatar color="primary" class="d-none d-sm-flex">
                                    <v-icon dark>mdi-card-bulleted-outline</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-medium">
                                        {{ item.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle style="font-size: 12px">
                                        {{ item.phone 
                                            ? `Tel: ${item.phone}` 
                                            : 'Sin telefono' 
                                        }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </div>
                    </template>
                    
                    <template v-slot:item.guests="{ item }">
                        <div v-if="item.confirm">
                            <v-chip small outlined color="success">
                                {{ item.n_guests }} 
                                <v-icon right small>mdi-checkbox-marked-circle</v-icon>
                            </v-chip>
                            <v-chip small outlined class="ml-1 ml-sm-0 ml-md-1 mt-0 mt-sm-1 mt-md-0" color="warning">
                                {{ item.guests - item.n_guests }} 
                                <v-icon right small>mdi-close-circle</v-icon> 
                            </v-chip>
                        </div>
                        <div v-else>
                            <v-chip small outlined >
                                {{ item.guests }} 
                                <v-icon right small>mdi-account-outline</v-icon>
                            </v-chip>
                        </div>
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip v-if="item.status === 'Asistire' 
                                && item.n_guests !== 0 &&
                                item.n_guests === item.guests"
                            color="success"
                            small
                            label
                        >
                            {{ item.status }}
                        </v-chip>
                        <v-chip v-if="item.status === 'Asistire' 
                                && item.n_guests !== 0 &&
                                item.n_guests !== item.guests"
                            color="warning"
                            small
                            label
                        >
                            {{ item.status }}
                        </v-chip>
                        <v-chip v-if="item.status === 'No asistire'"
                            color="danger"
                            small
                            label
                        >
                            {{ item.status }}
                        </v-chip>
                        <v-chip v-if="item.status === 'Sin responder'"
                            small
                            label
                        >
                            Pendiente
                        </v-chip>
                    </template>
                    <template v-slot:item.link="{ item }">
                        <v-btn 
                            @click="copyLink(item.link)" 
                            color="secondary"
                            small 
                            text 
                            outlined
                            class="mt-sm-1 mt-md-0"
                        >
                            Link <v-icon small class="ml-1">mdi-content-copy</v-icon>
                        </v-btn>
                        <v-btn 
                            @click="sendWhatsapp(item.link, item.phone)" 
                            color="secondary"
                            small 
                            text 
                            outlined
                            class="ml-1 ml-sm-0 ml-md-1 my-0 my-sm-1 my-md-0"
                        >
                            <v-icon small>mdi-whatsapp</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-menu>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>

                            <v-list dense color="py-0">
                                <v-list-item @click="openDialog(item.id)">
                                    <v-list-item-content class="text-caption">
                                        Editar
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon small>
                                            mdi-pencil
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <v-list-item-content class="text-caption">
                                        Expirar
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon small>
                                            mdi-calendar-remove
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item @click="deleteGuest(item.id)">
                                    <v-list-item-content class="text-caption">
                                        Eliminar
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon small>
                                            mdi-delete
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
                <!-- eslint-enable -->
                <v-card-text v-else class="no-invitations text-center d-flex">
                    <div class="ma-auto">
                        <v-icon large>
                            mdi-card-bulleted-settings-outline
                        </v-icon>
                        <p>Sin Invitaciones Creadas</p>
                    </div>
                </v-card-text>
            </v-card>

            <formInvitation
                :id="dialog.id"
                :n_guests="dialog.n_guests"
                :name_inv="dialog.name"
                :open="dialog.open"
                @close="closeDialog"
            />
        </div>
        <div class="main-helper d-flex" v-else>
            <div v-if="loading" class="ma-auto">
                <v-progress-circular
                    :size="50"
                    :width="7"
                    color="primary-dashboard"
                    indeterminate
                ></v-progress-circular>
            </div>
            <div v-else>
                <p class="title">Invitación inválida</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import formInvitation from '../components/formGuest.vue'
import information from '../components/informationGuests.vue'
import Navbar from '../components/navigation/navbar.vue'
export default {
    name: 'dashboard',
    components: { formInvitation, information, Navbar },
    computed: {
        ...mapState({
            ready: (state) => state.admin.wedding !== null,
            guests: (state) =>
                state.admin.list.map((guest) => {
                    const item = {
                        id: guest.id,
                        name: guest.name,
                        guests: guest.guests,
                        status: 'Sin responder',
                        confirm: guest.confirm,
                        n_guests: 0,
                        phone: '',
                        link: '',
                        out_time: guest.out_time ? true : false,
                    }
                    if (guest.confirm) {
                        item.status = guest.confirm.answer
                            ? 'Asistire'
                            : 'No asistire'
                        item.n_guests = guest.confirm.n_guests
                            ? guest.confirm.n_guests
                            : 0
                        item.phone = guest.confirm.phone
                            ? guest.confirm.phone
                            : ''
                    }
                    item.link = `https://invitations-wedding.web.app/${state.admin.configurations.uid}/${guest.id}`
                    return item
                }),
        }),
    },
    data() {
        return {
            loading: true,
            filters: null,
            filter_status: null,
            search: '',
            dialog: {
                open: false,
                id: null,
                name: '',
                n_guests: null,
            },
        }
    },
    methods: {
        ...mapActions({
            setWedding: 'admin/setWedding',
            updateList: 'admin/fetchList',
            saveDelete: 'admin/deleteGuest',
            blockGuest: 'admin/blockGuest',
            setView: 'view/setView'
        }),
        openDialog(id) {
            if (!id) return this.dialog.open = true
            
            const index = this.guests.findIndex((g) => g.id === id)
            this.dialog.id = id
            this.dialog.name = this.guests[index].name
            this.dialog.n_guests = this.guests[index].guests
            this.dialog.open = true
        },
        closeDialog() {
            this.dialog.id = null
            this.dialog.name = ''
            this.dialog.n_guests = null
            this.dialog.open = false
        },
        createFilter(text) {
            this.search = text
        },
        async deleteGuest(id) {
            await this.saveDelete({ id })
        },
        async block(guest) {
            await this.blockGuest({
                id: guest.id,
                value: guest.out_time,
            })
        },
        sendWhatsapp(link, phone){
            const message = `¡Hola! Es un gusto poder invitarte para que seas parte del dia de boda. \nDentro de la invitación incluimos todos los datos, puedes ingresar dando clic en el enlace. Te pedimos que confirmes dentro de la invitación. \n¡Te esperamos! \n ${ link }`
            const url_wa = `https://wa.me/52${phone.replace(/\s/g, '')}?text=${encodeURI(message)}`
            console.log(url_wa)
            window.open(url_wa, '_blank')
        },
        copyLink(link) {
            const el = document.createElement('textarea')
            el.value = link
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            const selected =
                document.getSelection().rangeCount > 0
                    ? document.getSelection().getRangeAt(0)
                    : false
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            if (selected) {
                document.getSelection().removeAllRanges()
                document.getSelection().addRange(selected)
            }
        },
    },
    async mounted() {
        await this.updateList()
        this.loading = false
        this.setView('Invitations')
    },
}
</script>

<style scope>
.main {
    height: 100%;
    background-color: #f8f9fd;
}
.main-helper{
    height: 100%;
}
.no-invitations{
    min-height: 50vh;
}
</style>
