<template>
  <Card class="aspect-video">
    <CardHeader>
      <CardTitle>
        <div class="custom-card-title">
          Employee Status
          <Button type="button" @click="visible = true">
            Add
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent class="h-full">
      <div style="height: 100%" :data-ag-theme-mode="mode">
        <ag-grid-vue style="width: 100%; height: 100%;" @grid-ready="onGridReady" :rowData="employeeList"
          :columnDefs="columnDefs"></ag-grid-vue>
      </div>
    </CardContent>
  </Card>
  <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="visible = false"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import { onMounted, ref, shallowRef } from 'vue';
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import { useAsyncState, useColorMode } from '@vueuse/core';
import Database from "@tauri-apps/plugin-sql";
const visible = ref(false);

const mode = useColorMode()
// const theme = themeQuartz
//   .withParams(
//     {
//       backgroundColor: "--background",
//       foregroundColor: "--foreground",
//       browserColorScheme: "dark",
//     },
//     "dark",
//   );
const columnDefs = ref<ColDef[]>([
  { field: "id", headerName: "Employee ID" },
  { field: "name", },
  { field: "email" },
  { field: "salary" },
  // { field: "phone", headerName: "Phone NO."},
  // { field: "transactionId" },
  // { field: "bankName" },
  // { field: "paymentMethod", headerName: "Method of Payment" },
  // { field: "status" },
  // { field: "invoiceNumber", headerName: 'Invoice NO.' },
  // { field: "startDate" },
  // { field: "endDate" },
  // { field: "position" },
  // { field: "paymentDate", headerName: "Date of Payment"},
  // { field: "yearTotalPaid"}
]);

const gridApi = shallowRef<GridApi | null>(null);

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
  getEmployees();
};

type Employee = {
  id: number;
  name: string;
  email: string;
  salary: number;
};

// const dbInst = ref<Database>();
const dbRef = ref<Database>();

// const { state, isReady, isLoading, error, execute } = useAsyncState(
//   () => Database.load("sqlite:test.db").then(res => {
//     console.log('res', res);
//     dbRef.value = res
//   }),
//   null, // Initial state
//   {
//     resetOnExecute: false,
//   }
// );
const employeeList = ref<Employee[]>()
const isLoading = ref<boolean>(false);

onMounted(() => {
  console.log(`the component is now mounted.`);//, state, isLoading, error, execute);
  // loadDB()
});

// async function loadDB() {
//   try {
//     dbInst.value = await Database.load("sqlite:test.db");
//     //   setError("");
//     console.log('next: get dbinstance:');
//     //   setIsLoadingUsers(false);
//   } catch (error) {
//     console.log('error get dbinstance', error);
//     //   setError("Failed to get users - check console");
//   }
// }

// async function getEmployees2() {
//   if (isReady && state.value != null) {
//     const dbEmployee = await state.value.select<Employee[]>("SELECT * FROM employees");
//     employeeList.value = dbEmployee;
//     console.log('next: gting data from db:', dbEmployee);
//   } else if (error) {
//     console.log('error getting data from db:', error);
//   }
// }

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


async function setEmployee(employee: Omit<Employee, "id">) {
  try {
    isLoading.value = true;
    const db = await Database.load("sqlite:test.db");
    await db.execute("INSERT INTO users (name, email, salary) VALUES ($1, $2, $3)", [
      employee.name,
      employee.email,
      employee.salary
    ]);
    // getUsers().then(() => setIsLoadingUsers(false));
  } catch (error) {
    console.log(error);
    // setError("Failed to insert user - check console");
  } finally {
    isLoading.value = false;
  }
}
// expose the custom cell renderer for use within AG Grid
// defineExpose({CellComponentRenderer})
</script>