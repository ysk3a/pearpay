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
        type: Object as PropType<ICellRendererParams & { activeUpdate: Function}>, 
        required: true
    }
})

onMounted(() => {
    console.log('onMounted', props.params)
})
onBeforeMount(() => {
    console.log('onBeforeMount', props)
})
watch(() => props.params.context, (newVal) => {
    console.log(newVal)
}, { deep: true })
function invokeParentMethod() {
    console.log('::invokeParentMethod', props.params, props.params.context, JSON.stringify(props.params.context));
    props.params.activeUpdate(props.params);
}

</script>

<style scoped></style>