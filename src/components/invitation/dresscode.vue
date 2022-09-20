<template>
    <div>
        <v-toolbar dense flat>
            Código de vestimenta
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <v-text-field
                placeholder="Tipo"
                v-model="type"
                outlined
                solo
                flat
            />
            <v-text-field
                placeholder="Link con ideas"
                v-model="ideas"
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
                :disabled="!ideas || !type"
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
            dresscode: (state) => state.admin.configurations.dresscode || {
                ideas: null, type: null
            },
        }),
    },
    data() {
        return {
            type: null,
            ideas: null,
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
            this.type = this.dresscode.type
            this.ideas = this.dresscode.ideas
        },
        async trySave() {
            try {
                await this.updateSection({
                    name: 'dresscode',
                    data: {
                        ideas: this.ideas,
                        type: this.type
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
