import "primeicons/primeicons.css";
import "./style.css";
import "./index.css";
import "./flags.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';

import App from "./App.vue";
import ThemeSwitcher from './components/ThemeSwitcher.vue';
// @ts-expect-error process is a nodejs global
import AppState from './plugins/appState.js';
// @ts-expect-error process is a nodejs global
import Noir from './presets/Noir.js';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark', // 'system',
            cssLayer: false,
        }
    },
    ripple: true
});
app.use(AppState);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.component('ThemeSwitcher', ThemeSwitcher);

app.mount("#app");
