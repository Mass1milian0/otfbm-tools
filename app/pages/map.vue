<template>
    <div>
        <div class="flex flex-col md:flex-row items-center justify-center md:items-start">
            <div class="mt-4 mr-2 flex flex-col items-center">
                <h2 class="font-bold mb-2">map options</h2>
                <p>zoom level (preview only)</p>
                <div class="flex md:w-xl w-xs">
                    <USlider v-model="mapOptions.gridOptions.zoomLevel" :step="0.1" :min="0.1" :max="3" />
                    <UInput v-model="mapOptions.gridOptions.zoomLevel" class="w-16 ml-2" />
                </div>

                <p>cell size (px)</p>
                <div class="flex md:w-xl w-xs">
                    <USlider v-model="mapOptions.gridOptions.cellSizePx" :step="1" :min="20" :max="100"
                        @update:modelValue="handleImageLoad" />
                    <UInput v-model="mapOptions.gridOptions.cellSizePx" class="w-16 ml-2" @change="handleImageLoad" />
                </div>

                <p>grid transparency</p>
                <div class="flex md:w-xl w-xs">
                    <USlider v-model="mapOptions.gridOptions.transparency" :step="1" :min="0" :max="100"
                        @update:modelValue="handleImageLoad" />
                    <UInput v-model="mapOptions.gridOptions.transparency" class="w-16 ml-2" @change="handleImageLoad" />
                </div>

                <p>grid size</p>
                <div class="flex md:w-xl w-xs">
                    <USlider v-model="mapOptions.grid.width" :step="1" :min="1" :max="100"
                        @update:modelValue="handleImageLoad" />
                    <UInput v-model="mapOptions.grid.width" class="w-16 ml-2" @change="handleImageLoad" />
                </div>
                <div class="flex md:w-xl w-xs">
                    <USlider v-model="mapOptions.grid.height" :step="1" :min="1" :max="100"
                        @update:modelValue="handleImageLoad" />
                    <UInput v-model="mapOptions.grid.height" class="w-16 ml-2" @change="handleImageLoad" />
                </div>

                <div class="md:flex mt-4 space-x-2 hidden">
                    <UButton @click="startPanMode">Draw View</UButton>
                    <UButton @click="clearPan" variant="outline">Clear View</UButton>
                </div>
                <UModal title="Export Map" @close="isExporting = false">
                    <UButton color="secondary" class="md:w-xl w-xs mt-2 flex items-center justify-center font-bold text" @click="exportCommand">Export</UButton>
                    <template #content>
                        <div class="flex flex-col items-center m-4">
                            <h1>Your Map Settings</h1>
                            <UInput v-model="exportText" class="w-72 mb-2" readonly />
                            <UButton @click="copyToClipboard" color="primary">Copy to Clipboard</UButton>
                        </div>
                    </template>
                </UModal>

                <h2 class="font-bold my-2 hidden md:block">map preview</h2>
                <img :src="mapLink" alt="" class="max-w-xl hidden md:block" />
                <UAccordion class="md:hidden block max-w-xs border-2 rounded-2xl border-slate-700 px-2 my-2" :items="[{label:'Map Preview'}]">
                    <template #body="{ item }"> 
                        <div class="max-w-xs overflow-scroll">
                            <img :src="mapLink" alt="" class="" />
                        </div>
                    </template>
                </UAccordion>
            </div>

            <div class="max-w-72 max-h-72 md:max-h-none md:max-w-none md:h-[60rem] md:w-[60rem] mt-4 overflow-scroll pointer-events-none select-none">
                <div class="relative inline-block">
                    <img :src="mapOptions.bgImage || ''" alt="" @load="handleImageLoad" ref="mapRef"
                        class="block max-w-none w-auto h-auto" />

                    <div class="absolute top-0 left-0" ref="stageRef">
                        <div ref="overlayRef" class="absolute inset-0 pointer-events-none"
                            :class="{ 'cursor-crosshair': isPanning }">
                            <div ref="selectionRectRef" class="absolute hidden selection-rect"></div>
                        </div>

                        <div class="grid border border-white pointer-events-auto" ref="detectorRef" id="detector"
                            @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"
                            @mouseleave="onMouseLeave">
                            <div v-for="i in mapOptions.grid.width * mapOptions.grid.height" :key="i" :id="getCellId(i)"
                                ref="gridRefArray" class="border border-t-0 border-l-0 cell">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script lang="ts" setup>
const mapOptions = useMapStore()
const toast = useToast()
const detectorRef = useTemplateRef('detectorRef')
const selectionRectRef = useTemplateRef('selectionRectRef')
const gridRefArray = ref<HTMLElement[]>([])
const isExporting = ref(false)

const mapLink = computed(() => encode())
const transparency = computed(() => mapOptions.gridOptions.transparency / 100)
const exportText = ref<string>('')

/* selection / pan */
const isPanning = ref(false)
const isDragging = ref(false)
const dragStartCell = ref<{ col: number, row: number } | null>(null)
const dragEndCell = ref<{ col: number, row: number } | null>(null)

/* helpers */
function numberToLetters(n: number) {
    let letters = ''
    n += 1
    while (n > 0) {
        n--
        letters = String.fromCharCode(97 + (n % 26)) + letters
        n = Math.floor(n / 26)
    }
    return letters
}
function getCellId(i: number) {
    const width = mapOptions.grid.width
    const colIndex = (i - 1) % width
    const rowIndex = Math.floor((i - 1) / width) + 1
    const colLetter = numberToLetters(colIndex)
    return `${colLetter}${rowIndex}`
}
function getCellCoordsFromId(id: string) {
    const m = id.match(/^([a-z]+)(\d+)$/i)
    if (!m) return { col: 0, row: 0 }
    const letters = (m?.[1] || '').toLowerCase()
    const row = parseInt(m[2] ?? '0') - 1
    let col = 0
    for (let i = 0; i < letters.length; i++)
        col = col * 26 + (letters.charCodeAt(i) - 97 + 1)
    return { col: col - 1, row }
}
function getCellIdFromCoords(col: number, row: number) {
    return numberToLetters(col) + (row + 1)
}
function clamp(v: number, lo: number, hi: number) {
    return Math.max(lo, Math.min(hi, v))
}
function pointToCell(clientX: number, clientY: number) {
    const rect = detectorRef.value!.getBoundingClientRect()
    const cx = clientX - rect.left
    const cy = clientY - rect.top
    const cell = mapOptions.gridOptions.cellSizePx
    let col = Math.floor(cx / cell)
    let row = Math.floor(cy / cell)
    col = clamp(col, 0, mapOptions.grid.width - 1)
    row = clamp(row, 0, mapOptions.grid.height - 1)
    return { col, row }
}
function drawSelectionBox(a: { col: number; row: number }, b: { col: number; row: number }) {
    const cell = mapOptions.gridOptions.cellSizePx
    const leftCol = Math.min(a.col, b.col)
    const rightCol = Math.max(a.col, b.col)
    const topRow = Math.min(a.row, b.row)
    const bottomRow = Math.max(a.row, b.row)
    const x = leftCol * cell
    const y = topRow * cell
    const w = (rightCol - leftCol + 1) * cell
    const h = (bottomRow - topRow + 1) * cell
    const r = selectionRectRef.value!
    r.style.left = `${x}px`
    r.style.top = `${y}px`
    r.style.width = `${w}px`
    r.style.height = `${h}px`
    r.classList.remove('hidden')
}
function hideSelectionBox() {
    selectionRectRef.value!.classList.add('hidden')
}

/* pan control */
function startPanMode() {
    isPanning.value = true
    isDragging.value = false
    dragStartCell.value = null
    dragEndCell.value = null
    hideSelectionBox()
}
function clearPan() {
    isPanning.value = false
    isDragging.value = false
    dragStartCell.value = null
    dragEndCell.value = null
    hideSelectionBox()
    mapOptions.gridOptions.panOptions.panStart = ""
    mapOptions.gridOptions.panOptions.panEnd = ""
}

/* mouse handlers */
function onMouseDown(e: MouseEvent) {
    if (!isPanning.value) return
    isDragging.value = true
    dragStartCell.value = pointToCell(e.clientX, e.clientY)
    drawSelectionBox(dragStartCell.value, dragStartCell.value)
    window.addEventListener('mouseup', onMouseUpWindow, { once: true })
}
function onMouseMove(e: MouseEvent) {
    if (!isPanning.value || !isDragging.value || !dragStartCell.value) return
    dragEndCell.value = pointToCell(e.clientX, e.clientY)
    drawSelectionBox(dragStartCell.value, dragEndCell.value)
}
function onMouseUp(e: MouseEvent) {
    if (!isPanning.value || !dragStartCell.value) return
    const end = isDragging.value ? pointToCell(e.clientX, e.clientY) : dragStartCell.value
    finishSelection(end)
}
function onMouseLeave() { }
function onMouseUpWindow(e: MouseEvent) {
    if (!isPanning.value || !dragStartCell.value) return
    const end = pointToCell(e.clientX, e.clientY)
    finishSelection(end)
}
function finishSelection(endCell: { col: number; row: number }) {
    isDragging.value = false
    dragEndCell.value = endCell
    const a = dragStartCell.value!
    const b = dragEndCell.value!
    drawSelectionBox(a, b)
    const startId = getCellIdFromCoords(Math.min(a.col, b.col), Math.min(a.row, b.row))
    const endId = getCellIdFromCoords(Math.max(a.col, b.col), Math.max(a.row, b.row))
    mapOptions.gridOptions.panOptions.panStart = startId
    mapOptions.gridOptions.panOptions.panEnd = endId
    isPanning.value = false
}

/* grid generation */
let handleImageLoad: any
onMounted(() => {
    handleImageLoad = async () => {
        const cell = mapOptions.gridOptions.cellSizePx
        detectorRef.value!.style.gridTemplateColumns = `repeat(${mapOptions.grid.width}, ${cell}px)`
        detectorRef.value!.style.gridTemplateRows = `repeat(${mapOptions.grid.height}, ${cell}px)`
        detectorRef.value!.style.width = `${cell * mapOptions.grid.width}px`
        detectorRef.value!.style.height = `${cell * mapOptions.grid.height}px`

        await nextTick()
        await new Promise(r => requestAnimationFrame(r))

        // restore previous pan box if set
        const ps = mapOptions.gridOptions.panOptions.panStart
        const pe = mapOptions.gridOptions.panOptions.panEnd
        if (ps && pe) {
            const a = getCellCoordsFromId(ps)
            const b = getCellCoordsFromId(pe)
            drawSelectionBox(a, b)
        }
    }
})

/* encoding & export */
function encode() {
    let url = `http://otfbm.io/${mapOptions.grid.width}x${mapOptions.grid.height}/@`
    url += encodeOptions()

    if (mapOptions.bgImage) url += `?bg=${encodeURIComponent(mapOptions.bgImage)}`
    return url
}

function encodeOptions() {
    let options = ''
    if (mapOptions.gridOptions.darkMode) options += 'd'
    if (mapOptions.gridOptions.transparency != null) options += `h${mapOptions.gridOptions.transparency}`
    if (mapOptions.gridOptions.noGrid) options += 'n'
    if (mapOptions.gridOptions.borderOpacity) options += 'e'
    if (mapOptions.gridOptions.zoomLevel != null) options += `z${mapOptions.gridOptions.zoomLevel}`
    if (mapOptions.gridOptions.cellSizePx != null) options += `c${mapOptions.gridOptions.cellSizePx}`

    const ps = mapOptions.gridOptions.panOptions.panStart
    const pe = mapOptions.gridOptions.panOptions.panEnd
    if (ps && pe) options += `/${ps}:${pe}`

    return options
}
function exportCommand() {
    exportText.value = `!map -attach map -mapsize ${mapOptions.grid.width}x${mapOptions.grid.height} -options ${encodeOptions()} -mapbg ${mapOptions.bgImage}`
}

function copyToClipboard() {
    navigator.clipboard.writeText(exportText.value)
    toast.add({
        title: 'Copied to clipboard',
        description: 'Map command has been copied to your clipboard.',
        icon: 'mdi:clipboard-check-multiple'
    })
}
</script>



<style scoped>
.selection-rect {
    border: 2px dashed rgba(255, 255, 0, 0.9);
    background: rgba(73, 73, 43, 0.2);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    border-radius: 2px;
}
.cell {
    border-color: rgba(255, 255, 255, v-bind(transparency));
}
</style>