<template>
    <div>
        <v-toolbar dense flat>
            Locaciones
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Ceremonia
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="ceremony_active"
                        hide-details
                    ></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="ceremony_active">
                    <v-text-field
                        placeholder="Nombre del lugar"
                        v-model="ceremony.place"
                        :label="locations.ceremony ? locations.ceremony.place: ''"
                        outlined
                        solo
                        flat
                    />
                    <v-text-field
                        placeholder="Link de google maps"
                        v-model="ceremony.link"
                        :label=" locations.ceremony ? locations.ceremony.link : ''"
                        outlined
                        solo
                        flat
                    />
                    <v-text-field
                        placeholder="Hora de inicio"
                        v-model="ceremony.time"
                        :label="locations.ceremony ? locations.ceremony.time: ''"
                        outlined
                        solo
                        flat
                    />
                </v-card-text>
            </v-card>
            <v-card outlined>
                <v-toolbar class="font-weight-bold" flat dense>
                    Recepción
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="party_active"
                        hide-details
                    ></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="party_active">
                    <v-text-field
                        placeholder="Nombre del lugar"
                        v-model="party.place"
                        :label="locations.party ? locations.party.place : ''"
                        outlined
                        solo
                        flat
                    />
                    <v-text-field
                        placeholder="Link de google maps"
                        v-model="party.link"
                        :label="locations.party ? locations.party.link : ''"
                        outlined
                        solo
                        flat
                    />
                    <v-text-field
                        placeholder="Hora de inicio"
                        v-model="party.time"
                        :label="locations.party ? locations.party.time : ''"
                        outlined
                        solo
                        flat
                    />
                </v-card-text>
            </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" @click="close">
                Cancelar
            </v-btn>
            <v-btn
                color="primary"
                :loading="save.loading"
                @click="trySave"
                :disabled="!ceremony_active && !party_active"
            >
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar v-model="save.message.status" :color="save.message.color">
            {{ save.message.text }}
        </v-snackbar>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'layout',
    computed: {
        ...mapState({
            locations: (state) => state.admin.configurations.locations || {},
        }),
    },
    data() {
        return {
            ceremony_active: false,
            ceremony: {
                link: null,
                place: null,
                time: null,
            },
            party_active: false,
            party: {
                link: null,
                place: null,
                time: null,
            },
            save: {
                loading: false,
                message: {
                    status: false,
                    color: '',
                    text: '',
                },
            },
        }
    },
    methods: {
        ...mapActions({
            updateSection: 'admin/editSectionInvitation',
        }),
        init(){
            this.ceremony_active = this.locations.ceremony !== undefined
            this.party_active = this.locations.party !== undefined
            if(this.ceremony_active)
                this.ceremony = this.locations.ceremony
            if(this.party_active)
                this.party = this.locations.party
            
        },
        async trySave() {
            if(this.ceremony_active && Object.values(this.ceremony).includes(null)){
                this.save.message.text = 'Hacen falta datos en ceremonia'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }
            
            if(this.party_active && Object.values(this.party).includes(null)){
                this.save.message.text = 'Hacen falta datos en recepcion'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }

            this.save.loading = true
            const data = {}
            if(this.ceremony_active) data.ceremony = this.ceremony
            if(this.party_active) data.party = this.party
            
            try {
                await this.updateSection({
                    name: 'locations',
                    data: data,
                })
                this.save.message.text = '¡Guardado!'
                this.save.message.color = 'success'
                this.save.message.status = true
                this.save.loading = false
            } catch (error) {
                this.save.loading = false
            }
            this.close()
        },
        close() {
            this.$emit('close')
        },
    },
    mounted() {
        this.init()
    },
}
</script>

<style scoped>
.v-toolbar__content {
    padding-left: 0px;
}
</style>
