// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'
import {
    VFileUpload
} from 'vuetify/labs/VFileUpload'

// Vuetify
import {
    createVuetify
} from 'vuetify'

export default createVuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        defaultTheme: 'dark',
        themes: {
            light: {
                primary: '#2575fc',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',
            },
            dark: {
                background: '#121212',
                surface: '#1E1E1E',
                primary: '#2575fc',
                secondary: '#424242',
                accent: '#FF4081',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            }
        }
    },
    components: {
        VFileUpload,
    },
})