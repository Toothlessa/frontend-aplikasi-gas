// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'

// Vuetify
import {
    createVuetify
} from 'vuetify'

export default createVuetify({
    icons: {
        iconfont: 'fa' || 'md' || 'mdi'
    },
    theme: {
        themes: {
            dark: {
                background: '#F5F6FA'
            }
        }
    },
})