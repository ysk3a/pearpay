import "primeicons/primeicons.css";
import "./style.css";
import "./index.css";
import "./flags.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';

// //primevue:
// import Dialog from 'primevue/dialog';
// import InputText from 'primevue/inputtext';
// import Button from 'primevue/button';

import App from "./App.vue";
import ThemeSwitcher from './components/ThemeSwitcher.vue';
// @ts-expect-error process is a nodejs global
import AppState from './plugins/appState.js';
// @ts-expect-error process is a nodejs global
import Noir from './presets/Noir.js';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import router from "./router/index.ts";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

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
    ripple: true,
    components: {
        prefix: 'Prime'
    },
});
// app.component('InputText', InputText);
// app.component('Button', Button);
// app.component('Dialog', Dialog);

app.use(AppState);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(router);
app.component('ThemeSwitcher', ThemeSwitcher);

app.mount("#app");
