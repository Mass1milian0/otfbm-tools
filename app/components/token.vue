<template>
    <div>
        <div ref="tokenRef" class="flex items-center justify-center rounded-full">
            {{ label?.slice(0, 3) }}
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    label: String,
    tokenSize: String,
    color: String,
    cellPixelSize: {
        type: Number,
        required: true
    }
})

const tokenRef = useTemplateRef('tokenRef');
defineExpose({ tokenRef })
let decodedSize = 0;
switch (props.tokenSize?.toLowerCase()) {
    case 't':
    case 's':
    case 'm':
        decodedSize = 1;
        break;
    case 'l':
        decodedSize = 2;
        break;
    case 'h':
        decodedSize = 3;
        break;
    case 'g':
        decodedSize = 4;
        break;
}
onMounted(() => {
    tokenRef.value!.style.width = `${decodedSize * props.cellPixelSize}px`;
    tokenRef.value!.style.height = `${decodedSize * props.cellPixelSize}px`;
    tokenRef.value!.style.backgroundColor = props.color || 'red';
});


</script>

<style></style>