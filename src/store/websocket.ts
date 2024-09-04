import {create} from 'zustand'

interface IWebSocketStore {
    ws: any | null,
    setWs: (socket: any) => void,
}

export const useWebSocketStore = create<IWebSocketStore>((set) => ({
    ws: null,
    setWs: (newWs: any) => set({ws: newWs})
}))