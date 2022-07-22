import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#166088',
                secondary: '#2ca6a4',
                accent: '#731963',
                dark: '#070600',
                light: '#eeeeee',
                background: '#fff'
            },
        },
        options: {
            customProperties: true,
        },
    },
});