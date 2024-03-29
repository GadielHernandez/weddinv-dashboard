<template>
    <div class="main">
        <div v-if="ready" class="pa-3 pa-md-6 pt-0 pt-md-0">
            <v-toolbar flat class="title">
                <h4 class="title text-h5 my-0 font-weight-bold">Invitaciones</h4>
                <v-spacer></v-spacer>
                <v-btn small color="primary" outlined @click="$router.push({ name: 'InvitationsConfig' })">
                    Editar Invitación 
                </v-btn>
            </v-toolbar>

            <information class="mb-6"/>

            <v-card class="rounded-lg" outlined>
                <v-toolbar flat>
                    <v-select
                        v-model="filter_type"
                        :items="['Nombre', 'Invitado', 'Estatus']"
                        label="Filtro"
                        dense
                        flat
                        solo
                        outlined
                        hide-details
                        style="font-size: 12px; max-width: 110px;"
                        class="mr-1"
                        background-color="primary"
                        dark
                        @input="search = ''"
                    ></v-select>
                    <v-select
                        v-if="filter_type === 'Estatus'"
                        v-model="search"
                        :items="['Con Respuesta', 'Sin Respuesta']"
                        dense
                        label="Estatus"
                        solo
                        flat
                        outlined
                        hide-details
                    ></v-select>
                    <v-text-field
                        v-else
                        v-model="search"
                        label="Buscar"
                        append-icon="mdi-magnify"
                        dense
                        flat
                        solo
                        outlined
                        hide-details
                    />
                    <v-spacer></v-spacer>
                    <v-btn
                        class="px-3"
                        color="primary"
                        dark
                        @click="openInvitationForm()"
                        style="min-width: unset"
                    >
                        <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- eslint-disable -->
                <v-data-table
                    v-if="invitations && invitations.length > 0"
                    :headers="[
                        { text: '', value: 'name' },
                        { text: 'Invitados', value: 'guests', align: 'center', sortable: false },
                        { text: 'Link', value: 'link' },
                        { text: '', value: 'data-table-expand'},
                        { text: '', value: 'actions', sortable: false, align: 'right' },
                    ]"
                    :items="invitations"
                    :search="search"
                    :expanded.sync="expanded"
                    :custom-filter="customFilter"
                    show-expand
                    @click:row="clickRow"
                >
                    <template v-slot:item.name="{ item }">
                        <div>
                            <v-list-item>
                                <v-list-item-avatar color="primary" class="d-none d-sm-flex">
                                    <v-icon dark>mdi-card-account-details-outline</v-icon>
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
                                {{ item.guests.filter( g => g.confirmed ).length }} 
                                <v-icon right small>mdi-checkbox-marked-circle</v-icon>
                            </v-chip>
                            <v-chip small outlined class="ml-1 ml-sm-0 ml-md-1 mt-0 mt-sm-1 mt-md-0" color="warning">
                                {{ item.guests.filter( g => !g.confirmed ).length  }} 
                                <v-icon right small>mdi-close-circle</v-icon> 
                            </v-chip>
                        </div>
                        <div v-else>
                            <v-chip small outlined >
                                {{ item.guests.length }} 
                                <v-icon right small>mdi-account-outline</v-icon>
                            </v-chip>
                        </div>
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
                            :disabled="!item.phone"
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
                                <v-btn icon v-bind="attrs" v-on="on" small>
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>

                            <v-list dense color="py-0">
                                <v-list-item @click="openInvitationForm(item.id)" class="pr-1">
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
                                <v-list-item class="pr-1">
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
                                <v-list-item @click="deleteGuest(item.id)" class="pr-1">
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
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="py-0 px-md-8 px-4">
                            <v-list>
                                <v-list-item v-for="invitation in item.guests" :key="invitation.id" >
                                    <v-list-item-content>
                                        {{ invitation.name }} {{ invitation.confirm }}
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon v-if="!item.confirm">
                                            mdi-checkbox-blank-circle-outline
                                        </v-icon>
                                        <v-icon v-else-if="invitation.confirmed" color="success">
                                            mdi-check-circle-outline
                                        </v-icon>
                                        <v-icon v-else color="red">
                                            mdi-close-circle-outline
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </td>
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
                :open="invitation_form.open"
                :invitation="invitation_form"
                @close="closeInvitationForm"
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
import formInvitation from '../../components/formGuest.vue'
import information from '../../components/invitation/information.vue'
export default {
    name: 'dashboard',
    components: { formInvitation, information },
    computed: {
        ...mapState({
            ready: (state) => state.admin.wedding !== null,
            whatsapp_msg: (state) => state.admin.configurations.attendance.whatsapp_msg,
            invitations: (state) =>
                state.admin.list.map((invitation) => {
                    const item = {
                        id: invitation.id,
                        name: invitation.name,
                        guests: invitation.guests,
                        confirm: invitation.confirm,
                        phone: invitation.phone,
                        type: invitation.type,
                        link: '',
                        out_time: invitation.out_time ? true : false,
                    }
                    item.link = `https://${state.admin.configurations.uid}.web.app/${invitation.id}`
                    return item
                }),
        }),
    },
    data() {
        return {
            loading: true,
            filters: null,
            filter_type: 'Nombre',
            expanded: [],
            search: '',
            invitation_form: {
                open: false,
                id: null,
                name: '',
                phone: '',
                type: null,
                guests: null,
                confirmed: false
            }
        }
    },
    methods: {
        ...mapActions({
            setWedding: 'admin/setWedding',
            saveDelete: 'admin/deleteGuest',
            blockGuest: 'admin/blockGuest',
            setView: 'view/setView'
        }),
        clickRow(item){
            const isExpanded = this.expanded.find( i => i.id === item.id)
            if(isExpanded){
                this.expanded = []
                return
            }
            
            if(this.expanded.length > 0)
                this.expanded = []

            this.expanded.push(item)
        },
        openInvitationForm(id) {
            if (!id) return this.invitation_form.open = true
            
            const index = this.invitations.findIndex((g) => g.id === id)
            this.invitation_form.id = id
            this.invitation_form.name = this.invitations[index].name
            this.invitation_form.guests = this.invitations[index].guests
            this.invitation_form.phone = this.invitations[index].phone
            this.invitation_form.type = this.invitations[index].type
            this.invitation_form.confirmed = this.invitations[index].confirm === true
            this.invitation_form.open = true
        },
        closeInvitationForm() {
            this.invitation_form.id = null
            this.invitation_form.name = ''
            this.invitation_form.guests = null
            this.invitation_form.phone = ''
            this.invitation_form.type = ''
            this.invitation_form.open = false
        },
        customFilter(value, search, invitation) {
            if(this.filter_type === 'Estatus')
                return this.search === 'Con Respuesta'
                    ? invitation.guests.some( g => g.confirmed !== null )
                    : invitation.guests.some( g => g.confirmed === null )

            const serach_lower = search ? search.toString().toLowerCase(): ''
            if(this.filter_type === 'Nombre')
                return invitation.name
                    .toString()
                    .toLowerCase()
                    .includes(serach_lower)

            if(this.filter_type === 'Invitado')
                return invitation.guests
                    .some( guest => 
                        guest.name.toLowerCase().includes(serach_lower)
                    )

        },
        async deleteGuest(id) {
            await this.saveDelete({ id })
        },
        async block(invitation) {
            await this.blockGuest({
                id: invitation.id,
                value: invitation.out_time,
            })
        },
        sendWhatsapp(link, phone){
            let custom_message = this.whatsapp_msg
            custom_message += '\n\n' + link
            window.open('https://api.whatsapp.com/send?phone=52' + phone.replace(/\s/g, '') + '&text='+ encodeURIComponent(custom_message), '_blank')
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
    mounted() {
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
.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content{
    box-shadow: none !important;
}
</style>
