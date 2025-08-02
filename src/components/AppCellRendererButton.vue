<template>
    <div>
        <Button @click="invokeParentMethod">
            Open
        </Button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, PropType, watch } from 'vue';
import type { ICellRendererParams } from "ag-grid-community";

const props = defineProps({
    params: {
        type: Object as PropType<ICellRendererParams & { openDialog: Function}>, 
        required: true
    }
})

// onMounted(() => {
//     console.log('onMounted', props.params)
// })

// onBeforeMount(() => {
//     console.log('onBeforeMount', props)
// })

function invokeParentMethod() {
    props.params.openDialog("UPDATE", props.params);
}

</script>

<style scoped></style>