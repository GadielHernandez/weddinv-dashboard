<template>
    <div>
        <v-row>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Total</p>
                        <p class="text-h4 my-2 font-weight-black">
                            {{ info.total }}
                        </p>
                        <p class="mb-4 text-caption">Numero invitados</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Confirmados</p>
                        <p class="text-h4 my-2 font-weight-black d-flex">
                            {{ info.attend }} 
                            <v-chip v-if="info.total !== 0" class="text-caption my-auto ml-4 py-2" color="secondary" x-small> 
                                {{ parseInt(info.attend / info.total  * 100) }} %
                            </v-chip>
                        </p>
                        <p class="mb-4 text-caption">Personas con lugar confirmado</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Cancelados</p>
                        <p class="text-h4 my-2 font-weight-black d-flex">
                            {{ info.no_attend }}
                            <v-chip v-if="info.total !== 0" class="text-caption my-auto ml-4 py-2" color="secondary" x-small> 
                                {{ parseInt(info.no_attend / info.total  * 100) }} %
                            </v-chip>
                        </p>
                        <p class="mb-4 text-caption">Personas con lugar cancelado</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Pendientes</p>
                        <p class="text-h4 my-2 font-weight-black d-flex">
                            {{ info.total - info.attend - info.no_attend }}
                            <v-chip v-if="info.total !== 0" class="text-caption my-auto ml-4 py-2" color="secondary" x-small> 
                                {{ parseInt((info.total - info.attend - info.no_attend) / info.total  * 100) }} %
                            </v-chip>
                        </p>
                        <p class="mb-4 text-caption">Personas sin respuesta</p>
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
                    info.total += guest.guests.length
                    if (guest.confirm) {
                        guest.guests.forEach( guest_info => {
                            if(guest_info.confirmed) info.attend++
                            else info.no_attend++
                        })
                    }
                })
                
                return info
            },
        }),
    },
}
</script>

<style scoped>
.info-card{
    min-height: 100%
}
</style>