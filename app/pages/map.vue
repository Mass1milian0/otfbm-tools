<template>
    <div>
        <div class="flex flex-col items-center">
            <p>{{ mapLink }}</p>
            <div class="max-w-72 max-h-72 md:max-h-[100rem] md:max-w-[100rem] mt-4 overflow-scroll">
                <div class="relative inline-block">
                    <img :src="mapLink" alt="" @load="handleImageLoad" class="block w-auto h-auto max-w-none">
                    <div class="absolute grid gap-[1px]" ref="detectorRef" id="detector">
                        <div class="bg-red-800/35" v-for="i in mapOptions.grid.width * mapOptions.grid.height" :key="i"
                            :id="getCellId(i)" ref="gridRefArray">
                        </div>
                    </div>
                    <Token class="absolute" v-for="token in tokens" :key="token.position" :id="token.position"
                        :label="token.label" :tokenSize="token.size" :color="token.color"
                        :cell-pixel-size="mapOptions.gridOptions.cellSizePx - 1" ref="tokenRefs"></Token>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const mapOptions = useMapStore();
const detectorRef = useTemplateRef('detectorRef');
const gridRefArray = ref<HTMLElement[]>([]);
const grid = computed(() => {
    return gridRefArray.value.map(el => {
        return { id: el.id, element: el };
    });
});
const tokenStore = useTokenStore();
const tokens = ref(tokenStore.tokens);
const tokenRefs = ref<HTMLElement[]>([]);
const mapLink = computed(() => {
    return encode();
});
if (mapOptions.grid.width == 0) {
    navigateTo('/'); //no width means user got here by accident
}
let handleImageLoad: any;
function getCellId(i: number) {
    const width = mapOptions.grid.width
    const colIndex = (i - 1) % width
    const rowIndex = Math.floor((i - 1) / width) + 1

    const colLetter = numberToLetters(colIndex)
    return `${colLetter}${rowIndex}`
}

function numberToLetters(n: number) {
    let letters = ''
    n += 1 // shift from 0-based to 1-based
    while (n > 0) {
        n-- // adjust because A = 0 not 1
        letters = String.fromCharCode(97 + (n % 26)) + letters
        n = Math.floor(n / 26)
    }
    return letters
}
onMounted(() => {
  handleImageLoad = async () => {
    const cellSizePixelOffset = mapOptions.gridOptions.cellSizePx - 30

    // keep your magic numbers
    detectorRef.value!.style.top = `${31 + cellSizePixelOffset}px`
    detectorRef.value!.style.left = `${31 + cellSizePixelOffset}px`
    detectorRef.value!.style.gridTemplateColumns =
      `repeat(${mapOptions.grid.width}, ${29 + cellSizePixelOffset}px)`
    detectorRef.value!.style.gridTemplateRows =
      `repeat(${mapOptions.grid.height}, ${29 + cellSizePixelOffset}px)`

    // let layout settle
    await nextTick()
    await new Promise(r => requestAnimationFrame(r))

    // use the SAME positioned ancestor the tokens use
    const anchor = (detectorRef.value!.offsetParent as HTMLElement) ?? document.body
    const anchorRect = anchor.getBoundingClientRect()

    tokenRefs.value.forEach(t => {
      const el = t as any
      if (!el?.tokenRef?.parentElement) return

      const wrapper = el.tokenRef.parentElement as HTMLElement
      // make sure wrapper is absolutely positioned under the same anchor
      wrapper.style.position = 'absolute'

      const id = wrapper.id
      if (!id) return

      const token = tokenStore.tokens.find(tok => tok.position.toLowerCase() === id.toLowerCase())
      if (!token) return

      const cell = grid.value.find(c => c.id.toLowerCase() === token.position.toLowerCase())
      if (!cell) return

      const cellRect = cell.element.getBoundingClientRect()

      // viewport -> anchor-local, include anchor scroll
      const left = cellRect.left - anchorRect.left + anchor.scrollLeft
      const top  = cellRect.top  - anchorRect.top  + anchor.scrollTop

      wrapper.style.left = `${left}px`
      wrapper.style.top  = `${top}px`
      // or use transform if you prefer: wrapper.style.transform = `translate(${left}px, ${top}px)`
    })
  }
})

function encode() {
    let url = `http://otfbm.io/${mapOptions.grid.width}x${mapOptions.grid.height}/@`;
    // Append grid options
    if (mapOptions.gridOptions.darkMode) {
        url += "d";
    }
    if (mapOptions.gridOptions.transparency !== null) {
        url += `h${mapOptions.gridOptions.transparency}`;
    }
    if (mapOptions.gridOptions.noGrid) {
        url += `n`;
    }
    if (mapOptions.gridOptions.borderOpacity) {
        url += `e`;
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