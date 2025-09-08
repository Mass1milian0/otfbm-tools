interface Token {
    position: string;
    label: string;
    size: string;
    color: string;
}

export const useTokenStore = defineStore('tokenStore', {
    state: () => ({
        tokens: [] as Token[]
    })
})