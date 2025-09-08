/*
  localStorage.setItem("decoded","true");
  localStorage.setItem("grid", JSON.stringify(grid));
  localStorage.setItem("gridOptions", JSON.stringify(gridOptions));
  localStorage.setItem("bgImage", JSON.stringify(bgImage));
  localStorage.setItem("fighters", JSON.stringify(fighters));
  localStorage.setItem("objects", JSON.stringify(objects));
*/
export const useMapStore = defineStore('mapStore', {
  state: () => ({
    decoded: false,
    grid: {
        width: 0,
        height: 0
    },
    gridOptions: {
        darkMode: false,
        transparency: 100,
        noGrid: false,
        borderOpacity: false,
        zoomLevel: 1,
        cellSizePx: 30,
        panOptions: {
            x: 0,
            y: 0
        }
    },
    bgImage: '' as string | null | undefined,
    fighters: [] as any,
    objects: [] as any
  })
})