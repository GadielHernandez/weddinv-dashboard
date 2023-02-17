<template>
    <div>
        <v-dialog v-model="open" max-width="600px">
                <v-card>
                    <v-toolbar flat class="px-4 px-md-6">
                        <span class="headline" v-if="invitation.id">Editar invitación</span>
                        <span class="headline" v-else>Añadir invitación</span>
                        <v-spacer></v-spacer>
                        <div style="width: 65px">
                            <v-select
                                v-model="type_local"
                                :prepend-inner-icon="type_local === TYPES.PERSONAL ? 'mdi-account': 'mdi-account-group'"
                                :items="[{
                                    text: 'Personal',
                                    value: TYPES.PERSONAL
                                },{
                                    text: 'Grupal',
                                    value: TYPES.GRUPAL
                                }]" 
                                color="primary"
                                outlined
                                flat
                                solo
                                hide-details
                                :disabled="invitation.confirmed"
                                dense
                                class="type"
                                @input="setListGuests"
                            />
                        </div>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container>
                            <p class="font-weight-black">{{texts[type_local].TO.label}}</p>
                            <v-text-field
                                v-model="name_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                :label="texts[type_local].TO.placeholder"
                                persistent-hint
                                :disabled="invitation.confirmed"
                            ></v-text-field>
                            <p class="font-weight-black">{{texts[type_local].PHONE.label}}</p>
                            <v-text-field
                                v-model="phone_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                :label="texts[type_local].PHONE.placeholder"
                                persistent-hint
                                :disabled="invitation.confirmed"
                            ></v-text-field>
                            <v-card flat outlined class="rounded-lg">
                                <v-toolbar dense flat>
                                    <p class="font-weight-black my-auto">
                                    {{ texts[type_local].GUESTS.label }}</p>
                                    <v-spacer></v-spacer>
                                    <v-btn 
                                        color="primary" 
                                        small 
                                        outlined 
                                        class="my-auto" 
                                        :disabled="this.name_local === '' || invitation.confirmed"
                                        @click="addGuestName"
                                    >
                                        {{texts[type_local].GUESTS.button}}
                                    </v-btn>
                                </v-toolbar>
                                <v-divider></v-divider>
                                <v-card-text v-if="guests_local.length === 0" class="text-center">
                                    <span class="font-weight-bold">
                                        {{texts[type_local].GUESTS.empty}}
                                    </span>
                                </v-card-text>
                                <v-card-text v-else>
                                    <v-text-field
                                        v-for="(guest, index) in guests_local"
                                        v-model="guest.name"
                                        class="mt-2"
                                        color="primary"
                                        outlined
                                        flat
                                        solo
                                        hide-details=""
                                        :key="index"
                                        :disabled="invitation.confirmed"
                                        append-icon="mdi-delete"
                                        @click:append="deleteGuest(index)"
                                    ></v-text-field>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="closeDialog"
                            >Cerrar</v-btn
                        >
                        <v-btn 
                            color="primary" 
                            @click="saveChange"
                            :disabled="name_local === '' || invitation.confirmed"
                        >
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import TYPES from '../plugins/invitations-types'
export default {
    name: 'formInvitation',
    props: ['open', 'invitation'],
    data() {
        return {
            name_local: '',
            phone_local: '',
            guests_local: [],
            type_local: TYPES.GRUPAL,
            TYPES,
            texts: {
                [TYPES.GRUPAL]:{
                    TO:{
                        label: 'Para:',
                        placeholder: 'Nombre en la invitacion'
                    },
                    PHONE:{
                        label: 'Telefono a donde enviar:',
                        placeholder: 'Telefono celular'
                    },
                    GUESTS:{
                        label: 'Invitados',
                        button: 'Agregar',
                        empty: 'Hay que agregar invitados a la invitacion'
                    }
                },
                [TYPES.PERSONAL]:{
                    TO:{
                        label: 'Invitado:',
                        placeholder: 'Nombre del invitado'
                    },
                    PHONE:{
                        label: 'Telefono del invitado:',
                        placeholder: 'Telefono celular'
                    },
                    GUESTS:{
                        label: 'Acompañantes',
                        button: 'Agregar',
                        empty: 'Invitado sin acompañante'
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions({
            addGuest: 'admin/addGuest',
            saveEdit: 'admin/editGuest'
        }),
        closeDialog() {
            this.name_local = ''
            this.guests_local = [],
            this.phone_local = ''
            this.$emit('close')
        },
        setListGuests(){
            const guests = this.invitation.guests ? Array.from(this.invitation.guests) : []
            if(this.type_local === TYPES.PERSONAL && guests.length > 0)
                guests.shift()
            this.guests_local = guests
        },
        addGuestName(){
            this.guests_local.push({
                name: `${this.name_local} - ${this.type_local === TYPES.PERSONAL ? 'Acompañante': 'Invitado' }`,
                confirmed: null
            })
        },
        deleteGuest(index){
            this.guests_local.splice(index, 1)
        },
        async saveChange() {
            if(this.type_local === TYPES.PERSONAL)
                this.guests_local.unshift({
                    name: this.name_local,
                    confirmed: null
                })
            if(this.invitation.id === null)
                await this.addGuest({
                    name: this.name_local,
                    guests: this.guests_local,
                    phone: this.phone_local,
                    type: this.type_local
                })
            else
                await this.saveEdit({
                    id: this.invitation.id,
                    update: {
                        name: this.name_local,
                        guests: this.guests_local,
                        phone: this.phone_local,
                        type: this.type_local
                    }
                })
            this.closeDialog()
        }
    },
    watch: {
        open(value){
            if(value){
                this.name_local = this.invitation.name
                this.phone_local = this.invitation.phone
                this.type_local = this.invitation.type || TYPES.GRUPAL
                this.setListGuests()
            }
        },
    },
}
</script>

<style>
.type .v-input__prepend-inner {
    margin: auto !important;
    padding: 0 !important;
}
.type .v-select__selections {
    display: none !important;
}
.type .v-select__slot {
    width: 25px !important;
}
.type .v-input__append-inner{
    margin: auto !important;
    padding: 0px !important;
}
.type .v-input__slot {
    padding: 0px !important;
}
</style>