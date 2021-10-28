<template>
    <div>
        <v-row>
            <v-col>
                <v-card @click="createFilter('')" style="min-height: 100%">
                    <v-card-text>
                        <p class="my-1">Total de invitados</p>
                        <p
                            class="text-h5 my-3 font-weight-black primary-dashboard--text"
                        >
                            {{ info.total }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card @click="createFilter('Asistire')" style="min-height: 100%">
                    <v-card-text>
                        <p>Invitados confirmados</p>
                        <p class="text-h5 my-3 font-weight-black green--text">
                            {{ info.attend }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card @click="createFilter('No asistire')" style="min-height: 100%">
                    <v-card-text>
                        <p>Invitados cancelados</p>
                        <p class="text-h5 my-3 font-weight-black warning--text">
                            {{ info.no_attend }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card @click="createFilter('Sin responder')" style="min-height: 100%">
                    <v-card-text>
                        <p>Invitados sin responder</p>
                        <p class="text-h5 my-3 font-weight-black">
                            {{ info.total - info.attend - info.no_attend }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'information',
    computed: {
        ...mapState({
            info: (state) => {
                const info = {
                    total: 0,
                    attend: 0,
                    no_attend: 0,
                }
                
                state.admin.list.forEach((guest) => {
                    info.total += guest.guests
                    if (guest.confirm) {
                        if (guest.confirm.answer) {
                            info.attend += guest.confirm.n_guests
                            info.no_attend +=
                                guest.guests - guest.confirm.n_guests
                        } else {
                            info.no_attend += guest.guests
                        }
                    }
                })
                
                return info
            },
        }),
    },
    methods: {
        createFilter(filter){
            this.$emit('emitFilter', filter)
        }
    },
}
</script>
