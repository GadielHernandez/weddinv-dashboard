<template>
    <div>
        <v-dialog v-model="open" max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline" v-if="id">Editar invitación</span>
                        <span class="headline" v-else>Añadir invitación</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container>
                            <p class="font-weight-black">Para: {{confirmed}}</p>
                            <v-text-field
                                v-model="name_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                label="Nombre en la invitacion"
                                persistent-hint
                                :disabled="confirmed"
                            ></v-text-field>
                            <p class="font-weight-black">Telefono a enviar:</p>
                            <v-text-field
                                v-model="phone_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                label="Telefono celular"
                                persistent-hint
                                :disabled="confirmed"
                            ></v-text-field>
                            <div class="d-flex">
                                <p class="font-weight-black my-auto">Invitados:</p>
                                <v-spacer></v-spacer>
                                <v-btn 
                                    color="primary" 
                                    small 
                                    text 
                                    class="my-auto" 
                                    :disabled="this.name_local === '' || confirmed"
                                    @click="addGuestName"
                                >
                                    Agregar
                                </v-btn>
                            </div>
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
                                :disabled="confirmed"
                            ></v-text-field>
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
                            :disabled="name_local === '' || confirmed"
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
export default {
    name: 'formInvitation',
    props: ['id', 'name_inv', 'phone', 'guests', 'open', 'confirmed'],
    data() {
        return {
            name_local: '',
            phone_local: '',
            guests_local: []
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
        addGuestName(){
            this.guests_local.push({
                name: `${this.name_local} - invitado`,
                confirmed: null
            })
        },
        async saveChange() {
            if(this.id === null)
                await this.addGuest({
                    name: this.name_local,
                    guests: this.guests_local,
                    phone: this.phone_local
                })
            else
                await this.saveEdit({
                    id: this.id,
                    update: {
                        name: this.name_local,
                        guests: this.guests_local,
                        phone: this.phone_local
                    }
                })
            this.closeDialog()
        }
    },
    watch: {
        name_inv(new_value){
            this.name_local = new_value
        },
        guests(new_value){
            if(new_value)
                this.guests_local = new_value
            else
                this.guests_local = []
        },
        phone(new_value){
            this.phone_local = new_value
        }
    },
}
</script>