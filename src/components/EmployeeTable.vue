<template>
  <Card class="aspect-video">
    <CardHeader>
      <CardTitle>
        <div class="custom-card-title">
          Employee Status
          <Button type="button">
            Add
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div style="height: 100%" :data-ag-theme-mode="mode">
        <ag-grid-vue style="width: 100%; height: 100%;" @grid-ready="onGridReady" :rowData="employeeList"
          :columnDefs="columnDefs"></ag-grid-vue>
      </div>
    </CardContent>
  </Card>


</template>

<script setup lang="ts">
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
import { useColorMode } from '@vueuse/core';
import Database from "@tauri-apps/plugin-sql";


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
});

// expose the custom cell renderer for use within AG Grid
// defineExpose({CellComponentRenderer})
</script>