<template>
  <div>
    <div class="flex flex-col items-center justify-center w-full h-screen">
      <div class="w-3/4 lg:w-1/6 border border-slate-700 rounded-lg p-4 m-4 flex items-center flex-col">
        <h2 class="text-lg font-semibold mb-2">OTFBM TOOLS</h2>
        <div class="flex my-2 w-56">
          <UInput v-model="decode" placeholder="load your OTFBM Link"
            style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;" />
          <UButton class="rounded-l-none" @click="decodeMap(decode)">Decode</UButton>
        </div>
        <p>or</p>
        <UModal>
          <UButton class="w-56 flex justify-center mt-2">Generate New</UButton>
          <template #content>
            <div class="flex flex-col items-center">
              <p>Grid Size</p>
              <div class="flex">
                <UInput v-model="generateNewOptions.width" placeholder="Width" class="w-10" />
                x
                <UInput v-model="generateNewOptions.height" placeholder="Height" class="w-10" />
              </div>
              <p class="mt-2">Background Image URL (optional)</p>
              <UInput v-model="generateNewOptions.bgImage" placeholder="Image URL" />
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
  width: 0,
  height: 0,
  bgImage: "",
  darkMode: true,
  transparency: 100,
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
}
function decodeMap(toDecode: string) {
  // Decode logic here
  //http://otfbm.io/25x33/@c160d/R17Mgy-Arak_Nadi/J31Mb-Tibur_Baeshara/K31M~53A5C5-Orin_Caelth/U15Mb-Umbra/N22Mb-Rakeas_the_quick/I30Mr-SC1/L32Mb-Dorran/*s5wp18/?a=2&bg=https://pencooks.net/seth/wp-content/uploads/maps/wildlands/forests/map-05.01-midnight-rainforest-no-grid.jpg

  //from the string remove http://otfbm.io/ or https://otfbm.io/
  toDecode = toDecode.replace(/https?:\/\/otfbm\.io\//, "");
  console.log(toDecode);
  //first we need to find grid size, find a number x number using regex
  const gridSizeRegex = /(\d+)x(\d+)/;
  const gridSizeMatch = gridSizeRegex.exec(toDecode);

  let grid: Grid | null = null; // Initialize grid as null
  let gridOptions: GridOptions = {
    darkMode: false,
    transparency: 100,
    noGrid: false,
    borderOpacity: false,
    zoomLevel: 1,
    cellSizePx: 30,
  };

  // Check if gridSizeMatch exists
  if (gridSizeMatch) {
    grid = {
      width: gridSizeMatch[1] ? parseInt(gridSizeMatch[1], 10) : 0,
      height: gridSizeMatch[2] ? parseInt(gridSizeMatch[2], 10) : 0,
    };
  }

  // Remove grid size from the string
  toDecode = toDecode.replace(gridSizeRegex, "");
  console.log("Grid Size:", grid);
  console.log("Remaining String:", toDecode);

  // Clean up the string before applying regex
  toDecode = toDecode.replace(/^\//, ""); // Remove leading slash if present

  // Regex for each grid option
  const darkModeRegex = /@d/;
  const transparencyRegex = /h(\d+)/;
  const noGridRegex = /@n/;
  const borderOpacityRegex = /@e/;
  const zoomLevelRegex = /z(\d+)/;
  const cellSizeRegex = /c(\d+)/;

  // Extract and set each option in gridOptions
  gridOptions.darkMode = darkModeRegex.test(toDecode);
  gridOptions.transparency = transparencyRegex.test(toDecode)
    ? parseInt(transparencyRegex.exec(toDecode)?.[1] || "0", 10)
    : 100;
  gridOptions.noGrid = noGridRegex.test(toDecode);
  gridOptions.borderOpacity = borderOpacityRegex.test(toDecode);
  gridOptions.zoomLevel = zoomLevelRegex.test(toDecode)
    ? parseInt(zoomLevelRegex.exec(toDecode)?.[1] || "0", 10)
    : 1;
  gridOptions.cellSizePx = cellSizeRegex.test(toDecode)
    ? parseInt(cellSizeRegex.exec(toDecode)?.[1] || "0", 10)
    : 30;

  // Remove matched options from the string
  toDecode = toDecode.replace(darkModeRegex, "");
  toDecode = toDecode.replace(transparencyRegex, "");
  toDecode = toDecode.replace(noGridRegex, "");
  toDecode = toDecode.replace(borderOpacityRegex, "");
  toDecode = toDecode.replace(zoomLevelRegex, "");
  toDecode = toDecode.replace(cellSizeRegex, "");

  // Log the extracted grid options
  console.log("Grid Options:", gridOptions);

  //remove a=2& from the string
  toDecode = toDecode.replace(/a=\d+&/, "");

  const bgImageMatch = /bg=([^&]+)/.exec(toDecode);
  const bgImage = bgImageMatch ? bgImageMatch[1] : null;

  //remove it from string to avoid confusion together with the tail ? or &
  toDecode = toDecode.replace(/[?&]bg=[^&]+/, "");

  console.log("string left:", toDecode);

  //everything else is fighters data and or, overlays and actions
  //first we get the fighters
  //fighters have a lot of options:
  /*
    first its where they are
    A1, B6, C4
    second is theirs size:
    t,s,m,l,h,g
    third is their color, which has 2 different way
    could be w,c, any shorthand color or be followed by a tilde and have a hexadecimal
    lastly followed by a - its their name
    so for example:
    A1Mc-alice would be a fighter in a1, medium size, color c, and the name alice


    Valid colorcodes:
    Color 	Code
    White 	w
    Black 	bk k
    Gray 	gy e a
    Red 	r
    Green 	g
    Blue 	b
    Yellow 	y
    Purple 	p
    Cyan 	c
    Brown 	bn n
    Orange 	o
    Pink 	pk
  */

  //knowing that, extract the fighters
  const fighters = [];
  const colorMap = {
    w: "#FFFFFF",
    bk: "#000000",
    gy: "#808080",
    r: "#FF0000",
    g: "#00FF00",
    b: "#0000FF",
    y: "#FFFF00",
    p: "#800080",
    c: "#00FFFF",
    bn: "#A52A2A",
    o: "#FFA500",
    pk: "#FFC0CB"
  };
  const fighterRegex = /([A-Za-z]\d+)([tsmlhgc])(?:~([0-9A-Fa-f]{6})|([A-Za-z]{1,2}))?-(\S+?)(?=\/|\s|$)/gi;
  let match;
  while ((match = fighterRegex.exec(toDecode)) !== null) {
    const [, coord, sizeRaw = 'm', hexColor, colorCodeRaw = '', name] = match;
    const size = sizeRaw.toLowerCase();
    const color = hexColor
      ? `#${hexColor}`
      : colorMap[colorCodeRaw.toLowerCase() as keyof typeof colorMap] || '#000000';
    fighters.push({ coord, size, color, name });
  }

  //remove any remaining fighter data from the string
  toDecode = toDecode.replace(/([A-Za-z]\d+)([tsmlhgc])(?:~([0-9A-Fa-f]{6})|([A-Za-z]{1,2}))?-(\S+?)(?=\/|\s|$)/gi, "");

  //lastly what's left, if anything is going to be objects, overlay, actions, arrows, anything

  /*
    An arrow: *a followed by <color><start_point><end _point>
    A centered circle: *c circle 20 diameter r color d5 center coordinate
    A top left centered circle: *ct circletop 10 diameter y color f2 center coordinate
    A bottom right of center circle: *co circlecorner 25 diameter g color h9 center coordinate for the ogre token
    cones: *t cone 30 length b color a5 start coordinate e5 direction coordinate, example: *t30ba5e5
    lines: *l line 30 length ,5 width g color a1 start coordinate b2 direction coordinate, example: *l30,5ga1b2
    
    squares: *s square 30 size c colour a1 start co-ordinate b2 direction co-ordinate
    Alternatively use *st to anchor the square at the top left. (Or don't specify the direction co-ordinate.)
  - with only <start>: draws an axis-aligned square anchored top-left at that coordinate
  - with <start> and <end>: draws a rotated square, where:
  • <end> defines the angle relative to <start>
  • example: *s30ca1b2 → diagonal 45° from a1 to b2
  • example: *s30ca1a2 → vertical 90° from a1 down to a2
  • if <end> == <start>, the square is drawn at <start> but offset half a grid forward

  examples:
    *s30ca1     → 30-unit cyan square, top-left anchored at a1
    *s30ca1b2   → 30-unit cyan square pointing diagonally from a1 toward b2
    *s30ca1a2   → 30-unit cyan square pointing downward from a1 to a2
    *s30ca1a1   → 30-unit cyan square centered on a1 but shifted half a cell


    any and all of these can be prefixed with *u to specify that it goes in the underlayer, example *uc20rd5
  */

  console.log("left to consume:", toDecode)

  const objects = [];
  //regex should match for arrows, centered circles, left centered circles, bottom centered circles, cones lines and squares, and keep in mind that it may be prefixed with *u
  const objectRegex = /(\*u)?([a-z]{1,2})(\d+(?:,\d+)?)([A-Za-z]{1,2})([A-Za-z]\d+)([A-Za-z]\d+)?/gi;
  let objectMatch;
  while ((objectMatch = objectRegex.exec(toDecode)) !== null) {
    const [, underlay, typeRaw = '', sizeRaw = '0', colorCodeRaw = '', start = '', direction = ''] = objectMatch;
    const type = typeRaw.toLowerCase();
    const size = sizeRaw.includes(',')
      ? parseFloat(sizeRaw.replace(',', '.'))
      : parseInt(sizeRaw, 10);
    const color = colorMap[colorCodeRaw.toLowerCase() as keyof typeof colorMap] || '#000000';
    objects.push({ underlay: !!underlay, type, size, color, start, direction });
  }

  mapOptions.decoded = true;
  mapOptions.grid = grid ?? { width: 0, height: 0 };
  mapOptions.gridOptions = gridOptions;
  mapOptions.bgImage = bgImage;
  mapOptions.fighters = fighters;
  mapOptions.objects = objects;

  navigateTo('/map');
}

function generateNewMap() {
  // Logic to generate a new map based on the options
  const grid: Grid = {
    width: generateNewOptions.value.width,
    height: generateNewOptions.value.height
  };

  const gridOptions: GridOptions = {
    darkMode: generateNewOptions.value.darkMode,
    transparency: generateNewOptions.value.transparency,
    noGrid: generateNewOptions.value.transparency === 0,
    borderOpacity: generateNewOptions.value.borderOpacity,
    zoomLevel: generateNewOptions.value.zoomLevel,
    cellSizePx: generateNewOptions.value.cellSizePx
  };
  mapOptions.decoded = false;
  mapOptions.grid = grid ?? {};
  mapOptions.gridOptions = gridOptions;

  navigateTo('/map');
}

</script>

<style></style>