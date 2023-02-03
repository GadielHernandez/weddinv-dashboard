<template>
    <div>
        <v-toolbar dense flat>
            Configuraciones
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <p class="font-weight-bold">Fecha limite para responder</p>
            <v-menu
                v-model="limit.open"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="limit.value"
                        label="Fecha"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        solo
                        flat
                    ></v-text-field>
                </template>
                <v-date-picker v-model="limit.date" @input="setLimitDate" />
            </v-menu>
            <p class="font-weight-bold">Mensaje para whatsapp</p>
            <v-textarea
                placeholder="Mensaje"
                v-model="whatsapp_msg"
                outlined
                solo
                flat
            />
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
                :disabled="!limit.value || !whatsapp_msg"
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
            attendance: (state) =>
                state.admin.configurations.attendance || {
                    limit: null,
                    whatsapp_msg: null,
                },
        }),
    },
    data() {
        return {
            limit: {
                open: false,
                date: null,
                value: null,
            },
            whatsapp_msg: null,
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
        init() {
            this.limit.value = this.attendance.limit
            this.whatsapp_msg = this.attendance.whatsapp_msg
        },
        setLimitDate(date_str) {
            const months = [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ]
            const date = date_str.split('-')
            this.limit.value = `${date[2]} ${months[parseInt(date[1]) - 1]}`
            this.limit.open = false
        },
        async trySave() {
            try {
                await this.updateSection({
                    name: 'attendance',
                    data: {
                        limit: this.limit.value,
                        whatsapp_msg: this.whatsapp_msg,
                    },
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
