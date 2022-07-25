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
                            <p class="font-weight-black">Para:</p>
                            <v-text-field
                                v-model="name_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                label="Nombre en la invitacion"
                                persistent-hint
                            ></v-text-field>
                            <p class="font-weight-black">Numero de personas:</p>
                            <v-select
                                v-model="n_guests_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                :items="[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ]"
                                label="Numero de asistentes maximo"
                                hide-details
                                class="mb-6"
                            ></v-select>
                            <p class="font-weight-black">Telefono:</p>
                            <v-text-field
                                v-model="phone_local"
                                color="primary"
                                outlined
                                flat
                                solo
                                label="Telefono celular"
                                persistent-hint
                            ></v-text-field>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="closeDialog"
                            >Cerrar</v-btn
                        >
                        <v-btn color="primary" @click="saveChange">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'formInvitation',
    props: ['id', 'name_inv', 'n_guests', 'phone', 'open'],
    data() {
        return {
            name_local: '',
            n_guests_local: null,
            phone_local: ''
        }
    },
    methods: {
        ...mapActions({
            addGuest: 'admin/addGuest',
            saveEdit: 'admin/editGuest'
        }),
        closeDialog() {
            this.name_local = ''
            this.n_guests_local = null,
            this.phone_local = ''
            this.$emit('close')
        },
        async saveChange() {
            if(this.id === null)
                await this.addGuest({
                    name: this.name_local,
                    guests: this.n_guests_local,
                    phone: this.phone_local
                })
            else
                await this.saveEdit({
                    id: this.id,
                    update: {
                        name: this.name_local,
                        guests: this.n_guests_local,
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
        n_guests(new_value){
            this.n_guests_local = new_value
        },
        phone(new_value){
            this.phone_local = new_value
        }
    },
}
</script>