<template>
    <div class="h-100 content-center login">
        <v-card
            class="pa-3 rounded-lg"
            elevation="5"
            :max-width="$vuetify.breakpoint.smAndUp ? null : '350'"
        >
            <v-card-text class="text-center pt-6">
                <v-img contain max-height="200" src="@/assets/logo.png"/>
                <p class="caption mb-0">!Bienvenido¡ Accede a tu cuenta</p>
                <div class="py-4">
                    <v-text-field
                        v-model="form.email"
                        label="Email Address"
                        solo
                        required
                        outlined
                        flat
                        hide-details
                        class="my-4"
                        color="secondary"
                    ></v-text-field>

                    <v-text-field
                        v-model="form.password"
                        label="Password"
                        type="password"
                        solo
                        required
                        outlined
                        flat
                        hide-details
                        class="my-4"
                        color="secondary"
                    ></v-text-field>
                </div>
                <v-card-actions class="px-0">
                    <v-btn
                        :loading="loading"
                        color="secondary"
                        block
                        @click="tryLogin"
                    >
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'Login',
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            loading: false
        }
    },
    methods: {
        ...mapActions({
            login: 'auth/login',
            gotTo: 'view/goToView'
        }),
        async tryLogin(){
            try {
                if(!this.form.email && !this.form.password)
                    return

                this.loading = true
                await this.login(this.form)
                this.loading = false
                this.gotTo('Invitations')
            } catch (error) {
                console.log(error)
                this.loading = false
            }
        }
    },
}
</script>

<style scoped>
.login {
    background-color: var(--v-primary-base) !important;
}
</style>
