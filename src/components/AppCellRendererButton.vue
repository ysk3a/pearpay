<template>
    <div>
        <Button>
            Open
        </Button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, PropType } from 'vue';
import type { ICellRendererParams } from "ag-grid-community";

const props = defineProps({
    params: {
        type: Object as PropType<ICellRendererParams>,// & { clickHandler: Function}>, 
        required: true
    }
})

onMounted(() => {
    console.log('onMounted', props.params)
})
onBeforeMount(() => {
    console.log('onBeforeMount', props)
})
</script>

<style scoped></style>