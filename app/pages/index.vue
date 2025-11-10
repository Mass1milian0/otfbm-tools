<template>
  <div>
    <div class="flex flex-col items-center justify-center w-full h-screen">
      <div class="w-3/4 lg:w-1/6 border border-slate-700 rounded-lg p-4 m-4 flex items-center flex-col">
        <h2 class="text-lg font-semibold mb-2">M1S0's Map Formatter</h2>
        <UModal>
          <UButton class="w-56 flex justify-center mt-2">Generate New</UButton>
          <template #content>
            <div class="flex flex-col items-center">
              <h1 class="font-bold mb-3">Initial Settings</h1>
              <p class="mt-2">Background Image URL</p>
              <UInput v-model="generateNewOptions.bgImage" @keydown.enter="generateNewMap" placeholder="Image URL" />
              <p>Grid Size</p>
              <div class="flex">
                <UInput v-model="generateNewOptions.width" placeholder="Width" class="w-10" type="number" :max="99" />
                x
                <UInput v-model="generateNewOptions.height" placeholder="Height" class="w-10" type="number" :max="99" />
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <p>Dark Mode</p>
                <UCheckbox v-model="generateNewOptions.darkMode" />
              </div>
              <UAccordion :items="items" class="w-52 border-2 rounded-2xl border-slate-700 px-2 mb-2">
                <template #body="{ item }">
                  <p>Grid Transparency</p>
                  <UInput v-model="generateNewOptions.transparency" placeholder="Transparency" />
                  <p>Grid Zoom Level</p>
                  <UInput v-model="generateNewOptions.zoomLevel" placeholder="Zoom Level" />
                  <p>Grid Cell Size (px)</p>
                  <UInput v-model="generateNewOptions.cellSizePx" placeholder="Cell Size" />
                  <div class="flex justify-center-center gap-2 mt-2">
                    <p>Map Border Opacity</p>
                    <UCheckbox v-model="generateNewOptions.borderOpacity" />
                  </div>
                </template>
              </UAccordion>
              <UButton @click="generateNewMap" class="w-52 mb-2 flex justify-center">Generate Map</UButton>
            </div>
          </template>
        </UModal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AccordionItem } from '@nuxt/ui'
const mapOptions = useMapStore();
const items: AccordionItem[] = [
  {
    label: "Advanced Options",
    icon: "mdi-cog"
  }
]
let decode = ref("");
let generateNewOptions = ref({
  width: 30,
  height: 30,
  bgImage: "",
  darkMode: true,
  transparency: 50,
  borderOpacity: true,
  zoomLevel: 1,
  cellSizePx: 30
});
// Define types for grid and gridOptions
interface Grid {
  width: number;
  height: number;
}

interface GridOptions {
  darkMode: boolean;
  transparency: number;
  noGrid: boolean;
  borderOpacity: boolean;
  zoomLevel: number;
  cellSizePx: number;
  panOptions?: {
    x?: number;
    y?: number;
  };
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function generateNewMap() {
  // Logic to generate a new map based on the options
  const grid: Grid = {
    width: clamp(generateNewOptions.value.width, 1, 99),
    height: clamp(generateNewOptions.value.height, 1, 99),
  };

  const gridOptions: GridOptions = {
    darkMode: generateNewOptions.value.darkMode,
    transparency: generateNewOptions.value.transparency,
    noGrid: generateNewOptions.value.transparency === 0,
    borderOpacity: generateNewOptions.value.borderOpacity,
    zoomLevel: generateNewOptions.value.zoomLevel,
    cellSizePx: generateNewOptions.value.cellSizePx,
  };
  mapOptions.decoded = false;
  mapOptions.grid = grid ?? {};
  //@ts-ignore you too
  mapOptions.gridOptions = gridOptions;
  mapOptions.bgImage = generateNewOptions.value.bgImage ?? "";
  mapOptions.gridOptions.panOptions = { panStart: "", panEnd: "" };
  navigateTo('/map');
}

</script>

<style></style>