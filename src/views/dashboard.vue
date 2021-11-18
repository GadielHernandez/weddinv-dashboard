<template>
    <div class="main">
        <div v-if="!loading && ready" class="pa-3 pa-md-6">
            <v-row>
                <v-col>
                    <p class="text-h4">Invitados</p>
                </v-col>
            </v-row>
            <information @emitFilter="createFilter" />
            <v-card class="pt-4 mt-3 rounded-lg">
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            class="ma-3 mt-0"
                            dense
                            flat
                            solo
                            outlined
                            hide-details
                        />
                    </v-col>
                    <v-col class="text-right">
                        <v-btn
                            color="primary-dashboard"
                            class="mr-3"
                            dark
                            @click="openDialog()"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-data-table
                    widt
                    :headers="[
                        { text: 'Nombre', value: 'name' },
                        { text: 'Invitados', value: 'guests', align: 'center' },
                        { text: 'Estatus', value: 'status', align: 'center' },
                        {
                            text: 'Confirmados',
                            value: 'n_guests',
                            align: 'center',
                        },
                        { text: 'Telefono', value: 'phone', align: 'center' },
                        { text: 'Link', value: 'link' },
                        { text: 'Expirar', value: 'out_time' },
                        { text: '', value: 'actions', sortable: false },
                    ]"
                    :items="guests"
                    :search="search"
                    class="mt-6"
                >
                    <template v-slot:item.status="{ item }">
                        <p
                            :class="{
                                'success--text': item.status === 'Asistire',
                                'warning--text': item.status === 'No asistire',
                                'grey--text':
                                    item.status !== 'Asistire' &&
                                    item.status !== 'No asistire',
                            }"
                            class="text-caption ma-auto d-flex"
                        >
                            {{ item.status }}
                            <span
                                class="d-flex pl-2"
                                v-if="
                                    item.n_guests != 0 &&
                                        item.n_guests !== item.guests
                                "
                            >
                                <v-icon small color="success"
                                    >mdi-account-minus</v-icon
                                >
                            </span>
                        </p>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-menu>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item @click="openDialog(item.id)">
                                    <v-icon small class="mr-2">
                                        mdi-pencil
                                    </v-icon>
                                    <span class="text-caption">Editar</span>
                                </v-list-item>
                                <v-list-item @click="deleteGuest(item.id)">
                                    <v-icon small class="mr-2">
                                        mdi-delete
                                    </v-icon>
                                    <span class="text-caption">Eliminar</span>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                    <template v-slot:item.link="{ item }">
                        <p class="ma-auto d-flex">
                            <span class="text-caption">{{ item.link }}</span>
                            <span class="d-flex">
                                <v-btn
                                    class="ma-auto"
                                    icon
                                    @click="copyLink(item.link)"
                                >
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-btn>
                            </span>
                        </p>
                    </template>
                    <template v-slot:item.out_time="{ item }">
                        <p class="ma-auto d-flex">
                            <v-switch
                                v-model="item.out_time"
                                color="primary-dashboard"
                                class="ma-2"
                                @change="block(item)"
                            ></v-switch>
                        </p>
                    </template>
                </v-data-table>
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
import information from '../components/information.vue'
import formInvitation from '../components/formInvitation.vue'
export default {
    name: 'dashboard',
    components: { information, formInvitation },
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
                    item.link = `https://invitations-wedding.web.app/${state.admin.wedding}/?inv=${guest.id}`
                    return item
                }),
        }),
    },
    data() {
        return {
            loading: true,
            filters: null,
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
        try {
            const { wedding } = this.$route.params
            if (!wedding) return (this.loading = false)

            const w = await this.setWedding(wedding)
            if (!w) return (this.loading = false)

            await this.updateList()
            this.loading = false
        } catch (error) {
            console.log(error)
            this.loading = false
        }
    },
}
</script>

<style>
.main {
    height: 100%;
    background-color: #f8f9fd;
}
.main-helper{
    height: 100%;
}
</style>
