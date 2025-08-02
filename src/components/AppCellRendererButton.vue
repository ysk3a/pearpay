<template>
    <div>
        <Button>
            Open
        </Button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, PropType } from 'vue';

//   const props = defineProps({
//     params: {
//       type: Object as PropType<ICellRendererParams & { clickHandler: Function}>, 
//       required: true
//     }
//   })

onMounted(() => {
    // console.log(props.params)
})
// function  beforeMount() {
//     this.cellValue = this.params.value;
//   }
//  function       buttonClicked() {
//             console.log('Software Launched');
//         }
</script>

<style scoped></style>