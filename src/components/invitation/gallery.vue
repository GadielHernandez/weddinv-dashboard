<template>
    <div>
        <v-toolbar dense flat>
            Galeria
            <v-spacer></v-spacer>
            <v-btn
                fab
                x-small
                color="primary"
                :loading="selecting.status"
                @click="handleFileImport"
            >
                <v-icon>
                    mdi-plus
                </v-icon>
                <input
                    ref="uploader"
                    class="d-none"
                    type="file"
                    @change="onFileChanged"
                />
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="py-8">
            <v-row>
                <v-col v-for="(image, index) in images" :key="index">
                    <div class="ma-auto text-center">
                        <v-img
                            :src="image.url"
                            height="150"
                            contain
                            max-width="150"
                            class="mx-auto"
                        />
                        <p>{{ image.name }}</p>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" @click="close">
                Cancelar
            </v-btn>
            <v-btn color="primary" @click="trySave" :loading="save.loading">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar v-model="save.message.status" :color="save.message.color">
            {{ save.message.text }}
        </v-snackbar>
    </div>
</template>

<script>
import { storage } from '../../plugins/firebase'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'layout',
    computed: {
        ...mapState({
            wedding: (state) => state.admin.wedding,
            gallery: (state) =>
                state.admin.configurations.gallery || {
                    images: {},
                },
        }),
    },
    data() {
        return {
            selecting: {
                status: false,
                image: null,
            },
            images: [],
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
        async init() {
            const images = this.gallery.images
            for (const name in images) {
                if (Object.hasOwnProperty.call(images, name)) {
                    const image = {
                        name: this.gallery.images[name],
                        url: null,
                        key: name,
                    }
                    const url = await this.getUrlImage(
                        this.gallery.images[name]
                    )
                    image.url = url
                    this.images.push(image)
                }
            }
        },
        getUrlImage(name) {
            return new Promise((resolve) => {
                const ref = storage.ref(`${this.wedding}/gallery/${name}`)

                ref.getDownloadURL()
                    .then((url) => resolve(url))
                    .catch(() => resolve(null))
            })
        },
        handleFileImport() {
            this.selecting.status = true

            window.addEventListener(
                'focus',
                () => {
                    this.selecting.status = false
                },
                { once: true }
            )

            this.$refs.uploader.click()
        },
        onFileChanged(e) {
            if (!e.target.files[0]) return
            const image = e.target.files[0]

            if (
                image.type !== 'image/png' &&
                image.type !== 'image/jpg' &&
                image.type !== 'image/jpeg'
            ) {
                this.save.message.text = 'Imagen inválida'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }
            if (image.size / 1024 / 1024 > 1.2) {
                this.save.message.text = 'La imagen debe ser menor a 1.2MB'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }

            if (this.images.find((img) => img.name === image.name)) {
                this.save.message.text = 'Ya existe una imagen con este nombre'
                this.save.message.color = 'warning'
                this.save.message.status = true
                return
            }

            const url = URL.createObjectURL(image)
            this.images.push({
                name: image.name,
                url,
                new: image,
            })
        },
        async trySave() {
            this.save.loading = true
            const images = {}
            this.images.forEach((img) => {
                if (img.new) {
                    const [name] = img.name.split('.')
                    const key = name.replace(/\s+/g, '')
                    images[key] = img.new
                    return
                }
                images[img.key] = img.name
            })
            
            try {
                await this.updateSection({
                    name: 'gallery',
                    data: {
                        images: images,
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
