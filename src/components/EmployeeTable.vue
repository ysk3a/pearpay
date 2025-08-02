<template>
  <Dialog v-model:open="visible">

    <Card class="aspect-video">
      <CardHeader>
        <CardTitle>
          <div class="custom-card-title">
            Employee Status
            <Button type="button" variant="outline" @click="openDialog('ADD')">
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
            :columnDefs="columnDefs" :rowSelection="rowSelection" :context="context"></ag-grid-vue>
        </div>
      </CardContent>
    </Card>

    <template v-if="dialogLayoutType == 'ADD'">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Add Employee details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">
              Email
            </Label>
            <Input id="email" placeholder="email@example.com" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="salary" class="text-right">
              Salary
            </Label>
            <Input id="salary" placeholder="$0.00" class="col-span-3" ref="inputRef" v-model="formattedValue"
              type="text" v-bind="$attrs" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </template>
    <template v-else-if="dialogLayoutType == 'UPDATE'">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Make changes to the selected Employee here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">
              Email
            </Label>
            <Input id="email" placeholder="email@example.com" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="salary" class="text-right">
              Salary
            </Label>
            <Input id="salary" placeholder="$0.00" class="col-span-3" ref="inputRef" v-model="formattedValue"
              type="text" v-bind="$attrs" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
// import Dialog from 'primevue/dialog';
// import Button from 'primevue/button';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { onBeforeMount, onMounted, ref, shallowRef, watch } from 'vue';
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectionOptions,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import { useAsyncState, useColorMode } from '@vueuse/core';
import { CurrencyDisplay, useCurrencyInput } from "vue-currency-input";
import Database from "@tauri-apps/plugin-sql";
import AppCellRendererButton from './AppCellRendererButton.vue';
const visible = ref(false);
type Employee = {
  id: number;
  name: string;
  email: string;
  salary: number;
};
// const formatOptions = ref<Intl.NumberFormatOptions>({
//   currency: "USD",
//   // currencyDisplay: 'name',
//   // currencySign: 'accounting',
//   style: 'currency',
//   // compactDisplay: 'long',
//   })
const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput(
  {
    "currency": "USD",
    "currencyDisplay": CurrencyDisplay.name,
    "precision": 2,
    "hideCurrencySymbolOnFocus": true,
    "hideGroupingSeparatorOnFocus": true,
    "hideNegligibleDecimalDigitsOnFocus": true,
    "autoDecimalDigits": false,
    "useGrouping": true,
    "accountingSign": false
  }
);
// const gridOptions = ref<GridOptions>({
//   context: 
// })
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
    cellRenderer: "AppCellRendererButton",
    cellRendererParams: {
      openDialog: openDialog.bind(this)
    }
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
const context = ref<any>({});

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
  getEmployees();
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

onBeforeMount(() => {
  context.value = {
    componentParent: function () { this },
  }
})

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

const dialogLayoutType = ref<string>('ADD');

function openDialog(openDialogType: string, cellProp?: ICellRendererParams) {
  if (openDialogType == 'ADD' && cellProp == undefined) {
    visible.value = true
    dialogLayoutType.value = 'ADD'
  } else if (cellProp && openDialogType == 'UPDATE') {
    visible.value = true
    dialogLayoutType.value = 'UPDATE'
  }
}

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

async function addEmployee(employee: Omit<Employee, "id">) {
  try {
    isLoading.value = true;
    // INSERT example
    const db = await Database.load("sqlite:test.db");
    const result = await db.execute("INSERT INTO employees (name, email, salary) VALUES ($1, $2, $3)",
      [
        employee.name,
        employee.email,
        employee.salary
      ]
    );
    console.log('::addEmployee', result);
    gridApi.value?.applyTransaction({ add: [result] });
    // getUsers().then(() => setIsLoadingUsers(false));
  } catch (error) {
    console.log(error);
    // setError("Failed to insert user - check console");
  } finally {
    isLoading.value = false;
  }
}


async function updateEmployee(employee: Employee) {
  try {
    isLoading.value = true;
    const db = await Database.load("sqlite:test.db");
    // UPDATE example
    const result = await db.execute(
      "UPDATE employees SET name = $1, email = $2, salary = $3 WHERE id = $3",
      [
        employee.name,
        employee.email,
        employee.salary,
        employee.id
      ]
    );
    console.log('::updateEmployee', result);
    gridApi.value?.applyTransaction({ update: [result] });
    // getUsers().then(() => setIsLoadingUsers(false));
  } catch (error) {
    console.log(error);
    // setError("Failed to insert user - check console");
  } finally {
    isLoading.value = false;
  }
}
// expose the custom cell renderer for use within AG Grid
defineExpose({ AppCellRendererButton })
</script>