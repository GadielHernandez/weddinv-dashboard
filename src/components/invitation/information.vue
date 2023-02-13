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
                        <p class="mb-4 text-caption">Numero invitaciones</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Contestadas</p>
                        <p class="text-h4 my-2 font-weight-black d-flex">
                            {{ info.answered }} 
                            <v-chip v-if="info.total !== 0" class="text-caption my-auto ml-4 py-2" color="secondary" x-small> 
                                {{ parseInt(info.answered / info.total  * 100) }} %
                            </v-chip>
                        </p>
                        <p class="mb-4 text-caption">Invitaciones con respuesta</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="info-card rounded-lg" outlined>
                    <v-card-text class="py-0">
                        <p class="mt-4 mb-0 font-weight-black">Pendientes</p>
                        <p class="text-h4 my-2 font-weight-black d-flex">
                            {{ info.total - info.answered }}
                            <v-chip v-if="info.total !== 0" class="text-caption my-auto ml-4 py-2" color="secondary" x-small> 
                                {{ parseInt((info.total - info.answered) / info.total  * 100) }} %
                            </v-chip>
                        </p>
                        <p class="mb-4 text-caption">Invitaciones sin respuesta</p>
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
                    answered: 0,
                    no_attend: 0,
                }
                
                state.admin.list.forEach((guest) => {
                    info.total += 1
                    if (guest.confirm) {
                        info.answered += 1
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