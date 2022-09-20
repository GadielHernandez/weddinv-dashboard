<template>
    <div>
        <v-toolbar dense flat>
            Mesas de reaglo
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <v-textarea
                placeholder="Descripcion"
                v-model="description"
                outlined
                solo
                flat
            />
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Regalo fisico
                    <v-spacer></v-spacer>
                    <v-checkbox v-model="gift.active" hide-details></v-checkbox>
                </v-toolbar>
            </v-card>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Sobre
                    <v-spacer></v-spacer>
                    <v-checkbox v-model="cash.active" hide-details></v-checkbox>
                </v-toolbar>
            </v-card>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Transferencia
                    <v-spacer></v-spacer>
                    <v-checkbox v-model="card.active" hide-details></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="card.active">
                    <v-text-field
                        placeholder="Banco"
                        v-model="card.bank"
                        outlined
                        solo
                        flat
                    />
                    <v-text-field
                        placeholder="Numero de tarjeta"
                        v-model="card.number"
                        outlined
                        solo
                        flat
                    />
                </v-card-text>
            </v-card>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Mesa Liverpool
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="liverpool.active"
                        hide-details
                    ></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="liverpool.active">
                    <v-text-field
                        placeholder="link"
                        v-model="liverpool.link"
                        outlined
                        solo
                        flat
                    />
                </v-card-text>
            </v-card>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Mesa Sears
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="sears.active"
                        hide-details
                    ></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="sears.active">
                    <v-text-field
                        placeholder="link"
                        v-model="sears.link"
                        outlined
                        solo
                        flat
                    />
                </v-card-text>
            </v-card>
            <v-card outlined class="mb-3">
                <v-toolbar class="font-weight-bold" flat dense>
                    Mesa amazon
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="amazon.active"
                        hide-details
                    ></v-checkbox>
                </v-toolbar>
                <v-card-text v-if="amazon.active">
                    <v-text-field
                        placeholder="link"
                        v-model="amazon.link"
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
            <v-btn color="primary" :loading="save.loading" @click="trySave">
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
            gifts: (state) =>
                state.admin.configurations.gifts || {
                    description: null,
                    gift: {
                        active: false,
                    },
                    cash: {
                        active: false,
                    },
                    card: {
                        active: false,
                        bank: null,
                        number: null,
                    },
                    liverpool: {
                        active: false,
                        link: null,
                    },
                    sears: {
                        active: false,
                        link: null,
                    },
                    amazon: {
                        active: false,
                        link: null,
                    },
                },
        }),
    },
    data() {
        return {
            description: null,
            gift: {
                active: false,
            },
            cash: {
                active: false,
            },
            card: {
                active: false,
                bank: null,
                number: null,
            },
            liverpool: {
                active: false,
                link: null,
            },
            sears: {
                active: false,
                link: null,
            },
            amazon: {
                active: false,
                link: null,
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
        init() {
            this.description = this.gifts.description
            if (this.gifts.gift && this.gifts.gift.active) this.gift = this.gifts.gift
            if (this.gifts.cash && this.gifts.cash.active) this.cash = this.gifts.cash
            if (this.gifts.card && this.gifts.card.active) this.card = this.gifts.card
            if (this.gifts.liverpool && this.gifts.liverpool.active) this.liverpool = this.gifts.liverpool
            if (this.gifts.sears && this.gifts.sears.active) this.sears = this.gifts.sears
            if (this.gifts.amazon && this.gifts.amazon.active) this.amazon = this.gifts.amazon
        },
        async trySave() {
            this.save.loading = true
            try {
                await this.updateSection({
                    name: 'gifts',
                    data: {
                        description: this.description,
                        gift: this.gift,
                        cash: this.cash,
                        card: this.card,
                        liverpool: this.liverpool,
                        sears: this.sears,
                        amazon: this.amazon,
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
