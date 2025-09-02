<template>
    <div>
        <div class="flex flex-col w-full h-screen items-center mt-4">
            <p>{{ mapLink }}</p>
            <div class="overflow-auto relative inline-block">
                <img :src="mapLink" alt="" @load="handleImageLoad" class="block object-contain max-w-full">
                <div class="absolute grid gap-[1px]" ref="detectorRef" id="detector">
                    <div class="bg-red-800" v-for="i in mapOptions.grid.width * mapOptions.grid.height" :key="i"></div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const mapOptions = useMapStore();
const detectorRef = useTemplateRef('detectorRef');
const mapLink = computed(() => {
    return encode();
});
if (mapOptions.grid.width == 0) {
    navigateTo('/'); //no width means user got here by accident
}
let handleImageLoad : any;
onMounted(() => {
    handleImageLoad = (img : any) => {
        const rect = img.target.getBoundingClientRect();

        const naturalWidth = img.target.naturalWidth;
        const naturalHeight = img.target.naturalHeight;

        const scaleX = rect.width / naturalWidth;
        const scaleY = rect.height / naturalHeight;

        const darkModeOffset = mapOptions.gridOptions.darkMode ? 10 : 0;
        const cellSizePixelOffset = 30 - mapOptions.gridOptions.cellSizePx;

        console.log({scaleX, scaleY, darkModeOffset});

        detectorRef.value!.style.top = `${41 * scaleY - darkModeOffset + cellSizePixelOffset}px`;
        detectorRef.value!.style.left = `${41 * scaleX - darkModeOffset + cellSizePixelOffset}px`;
        detectorRef.value!.style.gridTemplateColumns = `repeat(${mapOptions.grid.width}, ${39 * scaleX - darkModeOffset + cellSizePixelOffset}px)`;
        detectorRef.value!.style.gridTemplateRows = `repeat(${mapOptions.grid.height}, ${39 * scaleY - darkModeOffset + cellSizePixelOffset}px)`;

    }
});

function encode() {
    let url = `http://otfbm.io/${mapOptions.grid.width}x${mapOptions.grid.height}/`;
    // Append grid options
    if(mapOptions.gridOptions.darkMode) {
        url += "@d";
    }
    if (mapOptions.gridOptions.transparency !== null) {
        url += `h${mapOptions.gridOptions.transparency}`;
    }
    if (mapOptions.gridOptions.noGrid) {
        url += `n`;
    }
    if (mapOptions.gridOptions.borderOpacity) {
        url += `@e`;
    }
    if (mapOptions.gridOptions.zoomLevel !== null) {
        url += `z${mapOptions.gridOptions.zoomLevel}`;
    }
    if (mapOptions.gridOptions.cellSizePx !== null) {
        url += `c${mapOptions.gridOptions.cellSizePx}`;
    }
    // Append background image
    if (mapOptions.bgImage) {
        url += `?bg=${encodeURIComponent(mapOptions.bgImage)}`;
    }
    return url;
}
</script>