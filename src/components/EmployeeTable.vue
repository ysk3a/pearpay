<template>

  <Dialog v-model:open="visible" v-if="dialogLayoutType == 'UPDATE'">

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogDescription>
          Make changes to the selected Employee here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" id="dialogFormEdit">
        <div class="grid gap-4 py-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" v-bind="componentField" placeholder="Name" class="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input id="email" v-bind="componentField" placeholder="email" class="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="salary">
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input id="salary" placeholder="$0.00" class="col-span-3" ref="inputRef" v-model="formattedValue"
                  type="text" v-bind="componentField" autocomplete="off" @keydown.space.prevent />
              </FormControl>
              <FormDescription>
                Cannot contain comma separation. May Contain Decimal point up to 2 digits. Remaining digits will be dropped.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <Button type="submit" form="dialogFormEdit" :disabled="!form.meta.value.dirty || !form.meta.value.valid">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="visible" v-else-if="dialogLayoutType == 'ADD'">

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogDescription>
          Add Employee details here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit" id="dialogFormAdd">
        <div class="grid gap-4 py-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" v-bind="componentField" placeholder="Name" class="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input id="email" v-bind="componentField" placeholder="email" class="col-span-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="salary">
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input id="salary" placeholder="$0.00" class="col-span-3" ref="inputRef" v-model.lazy="formattedValue"
                  type="text" v-bind="componentField" autocomplete="off" @keydown.space.prevent />
              </FormControl>
              <FormDescription>
                Cannot contain comma separation. May Contain Decimal point up to 2 digits. Remaining digits will be dropped.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <Button type="submit" form="dialogFormAdd" :disabled="!form.meta.value.dirty || !form.meta.value.valid">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

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
          :columnDefs="columnDefs" :rowSelection="rowSelection" :context="context" :get-row-id="getRowId"
          @selection-changed="onSelectionChanged"></ag-grid-vue>
      </div>
    </CardContent>
  </Card>

  <!-- <template>

    </template> -->
  <!-- <template >

    </template> -->
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { h, onBeforeMount, onMounted, ref, shallowRef, watch } from 'vue';
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectionOptions,
  themeQuartz,
  ValidationModule,
  ValueGetterParams,
} from "ag-grid-community";
import { useAsyncState, useColorMode, watchDebounced } from '@vueuse/core';
import { CurrencyDisplay, useCurrencyInput, ValueScaling } from "vue-currency-input";
import Database from "@tauri-apps/plugin-sql";
import AppCellRendererButton from './AppCellRendererButton.vue';
type Employee = {
  id: number;
  name: string;
  email: string;
  salary: number; // valueScaling: ValueScaling.precision i.e. integer
  // should update table column in rust file to be INTEGER instead of BIGINT
};
import { toTypedSchema } from '@vee-validate/zod'
// import { z } from "zod/v4";
import * as z from 'zod'
import { configure, useForm } from 'vee-validate';
import { toast } from 'vue-sonner'

// const formSchema = z.object({
//   name: z.string(),
//   email: z.email(),
//   salary: z.bigint().check(z.gte(5n), z.lte(5n))
// });

// const formSchema2 = toZod<Employee>()({})
const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).regex(/(?!^\d+$)^.+$/).trim(),
  email: z.string().trim(),//.email(),
  salary: z.coerce.number()//.string(),//.coerce.number()//bigint()
}) satisfies z.ZodType<Omit<Employee, "id">>)



const form = useForm({
  validationSchema: formSchema,
})
// watch(() => form, (oldState, newState) => {
//   console.log('watch', oldState, newState, newState.isFieldDirty('name'))
// }, { deep: true })

const visible = ref(false);

const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput(
  {
    currency: "USD",
    // currencyDisplay: CurrencyDisplay.name,
    precision: 2,
    hideCurrencySymbolOnFocus: true,
    hideGroupingSeparatorOnFocus: true,
    hideNegligibleDecimalDigitsOnFocus: false,
    autoDecimalDigits: false,
    // useGrouping: true,
    accountingSign: false,
    valueScaling: ValueScaling.precision
  }
);
// const gridOptions = ref<GridOptions>({
//   context: 
// })
watchDebounced(numberValue, (value) => console.log('update:modelValue', value), { debounce: 1000 })

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
const currencyFormatter = new Intl.NumberFormat('en-US', {
  // style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const columnDefs = ref<ColDef[]>([
  { field: "id", headerName: "Employee ID" },
  { field: "name", },
  { field: "email" },
  {
    field: "salary",
    valueGetter: (params: ValueGetterParams) => {
      const amountInDollars = params.data.salary / 100; // Convert to decimal
      return currencyFormatter.format(amountInDollars);
    }
  },
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
const initialState = ref<GridState>({
  rowSelection: ["2"],
});
const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
  String(params.data.id),
);
const onSelectionChanged = () => {
  const selectedData = gridApi.value?.getSelectedRows();
  console.log('Selection Changed', selectedData);
};

// const getSelectedRowData = () => {
//   let selectedData = gridApi.value?.getSelectedRows();
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

// onMounted(() => {
//   console.log(`the component is now mounted.`);//, state, isLoading, error, execute);
//   // loadDB()
// });

onBeforeMount(() => {
  context.value = {
    componentParent: function () { this },
  }
})

const onSubmit = form.handleSubmit((values: Omit<Employee, "id">) => {
  console.log('::handleSubmit', values, dialogLayoutType, dialogLayoutType.value)
  if (dialogLayoutType.value == 'UPDATE') {
    // console.log('update', { id: selectedRowId.value, ...values, salary: numberValue.value ? numberValue.value : 0 })
    updateEmployee({ id: selectedRowId.value, ...values, salary: numberValue.value ? numberValue.value : 0 });
  } else if (dialogLayoutType.value == 'ADD') {
    addEmployee({ ...values, salary: numberValue.value ? numberValue.value : 0 });
    // console.log('add', values, numberValue.value)
  }
  // form.resetForm();
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

const selectedRowId = ref();
const selectedRowData = ref<Employee>();
const dialogLayoutType = ref<string>();

function openDialog(openDialogType: string, cellProp?: ICellRendererParams) {
  if (openDialogType == 'ADD' && cellProp == undefined) {
    dialogLayoutType.value = 'ADD'
    visible.value = true
  } else if (cellProp && openDialogType == 'UPDATE') {
    console.log('::openDialog, cellProp', cellProp)
    visible.value = true;
    dialogLayoutType.value = 'UPDATE';
    selectedRowId.value = cellProp.data.id;
    selectedRowData.value = cellProp.data;
    if (selectedRowData.value) {
      form.setValues({ ...selectedRowData.value, salary: selectedRowData.value.salary / 100 })
    }
  }
}

async function getEmployees() {
  try {
    const db = await Database.load("sqlite:test.db");
    const dbEmployee = await db.select<Employee[]>("SELECT * FROM employees"); // WHERE whatever period range
    //   setError("");
    employeeList.value = dbEmployee;
    console.log('next: gting data from db:', dbEmployee);
    //   setIsLoadingUsers(false);
  } catch (error) {
    console.log('error getting data from db:', error);
    //   setError("Failed to get users - check console");
  }
}
import { format } from 'date-fns';

// const { state, error } = useAsyncState(
//   Database.load("sqlite:test.db").then(res => res),
//   null // initial state
// );

async function addEmployee(employee: Omit<Employee, "id">) {
  try {
    isLoading.value = true;
    let transformEmployee: Omit<Employee, "id"> = {
      ...employee
    }
    // if (employee.salary == undefined || employee.salary.trim() == '') {
    //   transformEmployee.salary = '0.00';
    // }
    if (employee.salary == undefined) {
      transformEmployee.salary = 0;
    }
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
    const addedEmployee = await db.select<Employee[]>("SELECT * FROM employees WHERE id = $1", [result.lastInsertId]);
    visible.value = false
    gridApi.value?.applyTransaction({ add: addedEmployee });
    toast.info('New Employee Added', {
      description: `${format(new Date(), 'PPP HH:mm:ss')}`,
      // action: {
      //     label: 'Undo',
      //     onClick: () => console.log('Undo'),
      // },
      // style: {
      //     background: '#6ee7b7'
      // },
      // class: 'my-toast',
      // duration: Infinity,
      closeButton: true,
    })
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
    let transformEmployee: Employee = {
      ...employee
    }
    // if (employee.salary == undefined || employee.salary.trim() == '') {
    //   transformEmployee.salary = '0.00';
    // }
    if (employee.salary == undefined) {
      transformEmployee.salary = 0;
    }
    const db = await Database.load("sqlite:test.db");
    // UPDATE example
    const result = await db.execute(
      "UPDATE employees SET name = $1, email = $2, salary = $3 WHERE id = $4",
      [
        employee.name,
        employee.email,
        employee.salary,
        employee.id
      ]
    );
    visible.value = false
    const updatedEmployee = await db.select<Employee[]>("SELECT * FROM employees WHERE id = $1", [employee.id]);
    console.log('::updateEmployee', result, updatedEmployee);
    gridApi.value?.applyTransaction({ update: updatedEmployee });
    toast.info('Employee Updated', {
      description: `${format(new Date(), 'PPP HH:mm:ss')}`,
      // action: {
      //     label: 'Undo',
      //     onClick: () => console.log('Undo'),
      // },
      // style: {
      //     background: '#6ee7b7'
      // },
      // class: 'my-toast',
      // duration: Infinity,
      closeButton: true,
    })
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