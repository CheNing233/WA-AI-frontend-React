import create from 'zustand'

export type IWorkbenchSetting = {
    width?: string | number | any,
    setWidth?: (width: string | number) => void,
    wrapperInDrawer?: boolean,
    setWrapperInDrawer?: (wrapperInDrawer: boolean) => void,
}


export const useWorkbenchSetting = create((set) => ({
    width: '100vw',
    setWidth: (width: string | number) => set(() => ({width})),
    wrapperInDrawer: true,
    setWrapperInDrawer: (wrapperInDrawer: boolean) => set(() => ({wrapperInDrawer}))
}))
