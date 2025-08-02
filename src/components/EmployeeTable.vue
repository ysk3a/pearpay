<template>
    <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"></ag-grid-vue>
        </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
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
  ValidationModule,
} from "ag-grid-community";
const columnDefs = ref<ColDef[]>([
    { field: "make", },
    { field: "model" },
    { field: "price" },
    { field: "manufactured" }
]);

const rowData = ref([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
]);
    const gridApi = shallowRef<GridApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };
// expose the custom cell renderer for use within AG Grid
// defineExpose({CellComponentRenderer})
</script>