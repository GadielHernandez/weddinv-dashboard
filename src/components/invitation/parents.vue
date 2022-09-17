<template>
    <div>
        <v-toolbar dense flat>
            Sección de padres
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <p class="font-weight-bold">Foto</p>
            <v-file-input
                :label="parents.images.photo"
                v-model="photo"
                :prepend-icon="null"
                append-icon="mdi-image"
                outlined
                solo
                flat
                type="file"
                accept=".png, .jpg, .jpeg"
            ></v-file-input>
            <p class="font-weight-bold">Novia</p>
            <v-text-field
                placeholder="Padre de la novia"
                :label="parents.bride_father"
                v-model="bride.father"
                outlined
                solo
                flat
            />
            <v-text-field
                placeholder="Madre de la novia"
                :label="parents.bride_mother"
                v-model="bride.mother"
                outlined
                solo
                flat
            />

            <p class="font-weight-bold">Novio</p>
            <v-text-field
                placeholder="Padre del novio"
                :label="parents.groom_father"
                v-model="groom.father"
                outlined
                solo
                flat
            />
            <v-text-field
                placeholder="Madre del novio"
                :label="parents.groom_mother"
                v-model="groom.mother"
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
                :disabled="
                    !bride.father ||
                        !bride.mother ||
                        !groom.father ||
                        !groom.mother
                "
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
            parents: (state) =>
                state.admin.configurations.parents || {
                    images: { photo: null },
                    bride_mother: 'Madre de la novia',
                    bride_father: 'Padre de la novia',
                    groom_mother: 'Madre del novio',
                    groom_father: 'Padre del novio',
                },
        }),
    },
    data() {
        return {
            photo: null,
            bride: {
                father: null,
                mother: null,
            },
            groom: {
                father: null,
                mother: null,
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
        async trySave() {
            this.save.loading = true
            try {
                if (
                    this.photo.type !== 'image/png' &&
                    this.photo.type !== 'image/jpg' &&
                    this.photo.type !== 'image/jpeg'
                ) {
                    this.save.message.text = 'Imagen inválida'
                    this.save.message.color = 'warning'
                    this.save.message.status = true
                    return
                }
                if (this.photo.size / 1024 / 1024 > 1.2) {
                    this.save.message.text = 'La imagen debe ser menor a 1.2MB'
                    this.save.message.color = 'warning'
                    this.save.message.status = true
                    return
                }
                await this.updateSection({
                    name: 'parents',
                    data: {
                        bride_mother: this.bride.mother,
                        bride_father: this.bride.father,
                        groom_mother: this.groom.mother,
                        groom_father: this.groom.father,
                        images: {
                            photo: this.photo
                        }
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
}
</script>
