import EmployeeView from "@/views/EmployeeView.vue"
import PayrollView from "@/views/PayrollView.vue"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: PayrollView
        },
                {
            path: "/employee",
            name: "employee",
            component: EmployeeView
        }
    ]
})

export default router