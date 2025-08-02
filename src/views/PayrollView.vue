<template>
    <div id="PayrollView" class="flex flex-1 flex-col gap-4 p-4">
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div class="grid auto-rows-min gap-4 md:grid-cols-4">
                <div class="aspect-video rounded-xl">
                    <Card class="aspect-video">
                        <CardHeader>
                            <CardTitle>Provident Fund</CardTitle>
                        </CardHeader>
                        <CardContent>
                            $123,456,789.01
                        </CardContent>
                        <CardFooter>
                            12% increase since last month
                        </CardFooter>
                    </Card>
                </div>
                <div class="aspect-video rounded-xl">
                    <Card class="aspect-video">
                        <CardHeader>
                            <CardTitle>Expense</CardTitle>
                        </CardHeader>
                        <CardContent>
                            $123,456,789.01
                        </CardContent>
                        <CardFooter>
                            12% increase since last month
                        </CardFooter>
                    </Card>
                </div>
                <div class="aspect-video rounded-xl">
                    <Card class="aspect-video">
                        <CardHeader>
                            <CardTitle>Upcoming Salary Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            $123,456,789.01
                        </CardContent>
                        <CardFooter>
                            12% increase since last month
                        </CardFooter>
                    </Card>
                </div>
                <div class="aspect-video rounded-xl">
                    <Card class="aspect-video">
                        <CardHeader>
                            <CardTitle>Upcoming Salary Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            $123,456,789.01
                        </CardContent>
                        <CardFooter>
                            12% increase since last month
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div class="min-h-[100vh] flex flex-1 rounded-xl md:min-h-min gap-4 flex-wrap">
                <div class="aspect-video flex flex-2 flex-col grow-2 gap-4  basis-2xl rounded-xl">
                    <EmployeeTable />
                    <PayrollExpenseTable />
                </div>
                <div class="grid auto-rows-min gap-4  md:grid-cols-4 lg:grid-cols-1">
                    <div class="aspect-video rounded-xl  min-w-[220px]">
                        <Card class="aspect-video">
                            <CardHeader>
                                <CardTitle>Employee Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MeterGroup :value="value" />
                            </CardContent>
                        </Card>
                    </div>
                    <div class="rounded-xl min-w-[220px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <i class="pi pi-building-columns"></i>
                                    Linked Accounts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div class="flex flex-col">
                                    <span>Lightning Bank Account</span>
                                    <span class="text-green-700">Connected</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div class="rounded-xl min-w-[220px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <i class="pi pi-building-columns"></i>
                                    Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea class="h-72 rounded-md">
                                    <div class="p-4">
                                        <div v-for="tag in tags" :key="tag">
                                            <div class="text-sm">
                                                {{ tag }}
                                            </div>
                                            <Separator class="my-2" />
                                        </div>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    <div class="rounded-xl bg-muted/90 min-w-[220px]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <i class="pi pi-building-columns"></i>
                                    Linked Accounts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div class="flex flex-col">
                                    <span>Lightning Bank Account</span>
                                    <span class="text-green-700">Connected</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Database from "@tauri-apps/plugin-sql";

import AppSidebar from "../components/AppSidebar.vue";
import EmployeeTable from "../components/EmployeeTable.vue";
import PayrollExpenseTable from "../components/PayrollExpenseTable.vue";

const value = ref([
    { label: 'Apps', color: '#34d399', value: 16, icon: 'pi pi-table' },
    { label: 'Messages', color: '#fbbf24', value: 8, icon: 'pi pi-inbox' },
    { label: 'Media', color: '#60a5fa', value: 24, icon: 'pi pi-image' },
    { label: 'System', color: '#c084fc', value: 10, icon: 'pi pi-cog' }
]);
const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

type Employee = {
    id: number;
    name: string;
    email: string;
};
const employeeList = ref<Employee[]>()
async function getEmployees() {
    try {
        const db = await Database.load("sqlite:test.db");
        const dbEmployee = await db.select<Employee[]>("SELECT * FROM employees");
        //   setError("");
        employeeList.value = dbEmployee;
        console.log('next: gting data from db:', dbEmployee);
        //   setIsLoadingUsers(false);
    } catch (error) {
        console.log('error getting data from db:', error);
        //   setError("Failed to get users - check console");
    }
}

onMounted(() => {
    console.log(`the component is now mounted.`);
    getEmployees();

})

</script>

<style scoped></style>