<template>
  <Dialog v-model:open="visible">

    <Card class="aspect-video">
      <CardHeader>
        <CardTitle>
          <div class="custom-card-title">
            Employee Status
            <Button type="button" variant="outline" @click="visible = true">
              Add
            </Button>
            <!-- <DialogTrigger as-child>
              <Button variant="outline">
                Edit Profile
              </Button>
            </DialogTrigger> -->
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent class="h-full">
        <div style="height: 100%" :data-ag-theme-mode="mode">
          <ag-grid-vue style="width: 100%; height: 100%;" @grid-ready="onGridReady" :rowData="employeeList"
            :columnDefs="columnDefs" :rowSelection="rowSelection"></ag-grid-vue>
        </div>
      </CardContent>
    </Card>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          Save changes
        </Button>
        <!-- <DialogClose as-child>
          <Button type="button" variant="secondary" v-on:click="visible = false">
            Close
          </Button>
        </DialogClose> -->
      </DialogFooter>
    </DialogContent>
  </Dialog>



</template>

<script setup lang="ts">
// import Dialog from 'primevue/dialog';
// import Button from 'primevue/button';

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
  RowSelectionOptions,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import { useAsyncState, useColorMode } from '@vueuse/core';
import Database from "@tauri-apps/plugin-sql";
import AppCellRendererButton from './AppCellRendererButton.vue';
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
const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
  mode: "singleRow",
});
const columnDefs = ref<ColDef[]>([
  { field: "id", headerName: "Employee ID" },
  { field: "name", },
  { field: "email" },
  { field: "salary" },
  {
    pinned: 'right',
    colId: "actions",
    headerName: "Actions",
    cellRenderer: AppCellRendererButton,
  },
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
// const onSelectionChanged = () => {
//   const selectedData = gridApi.value.getSelectedRows();
//   console.log('Selection Changed', selectedData);
// };

// const getSelectedRowData = () => {
//   let selectedData = gridApi.value.getSelectedRows();
//   alert(`Selected Data:\n${JSON.stringify(selectedData)}`);
//   return selectedData;
// };

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