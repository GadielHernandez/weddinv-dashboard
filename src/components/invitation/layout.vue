<template>
    <div>
        <v-toolbar dense flat>
            Pantalla principal
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <p class="font-weight-bold">Imagen de fondo</p>
            <v-file-input
                :label="layout.images.background"
                v-model="image"
                :prepend-icon="null"
                append-icon="mdi-image"
                outlined
                solo
                flat
                type="file"
                accept=".png, .jpg, .jpeg"
            ></v-file-input>

            <p class="font-weight-bold">Texto</p>
            <v-text-field
                :label="layout.text"
                v-model="text"
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
            <v-btn color="primary" @click="trySave" :loading="save.loading" :disabled="!image || !text">
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
            layout: (state) =>
                state.admin.configurations.layout || {
                    images: { background: null },
                    text: null,
                },
        }),
    },
    data() {
        return {
            image: null,
            text: null,
            save: {
                loading: false,
                message: {
                    status: false,
                    color: '',
                    text: ''
                }
            },
        }
    },
    methods: {
        ...mapActions({
            updateSection: 'admin/editSectionInvitation',
        }),
        init() {
            this.text = this.layout.text
        },
        async trySave() {
            if (
                this.image.type !== 'image/png' &&
                this.image.type !== 'image/jpg' &&
                this.image.type !== 'image/jpeg'
            ) {
                this.save.message.text = 'Imagen inválida'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }
            if (this.image.size / 1024 / 1024 > 1.2) {
                this.save.message.text = 'La imagen debe ser menor a 1.2MB'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }
            this.save.loading = true
            try {
                await this.updateSection({
                    name: 'layout',
                    data: {
                        text: this.text,
                        images: {
                            background: this.image,
                        },
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
