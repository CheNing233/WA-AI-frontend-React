import {create} from 'zustand'

interface IImagePreviewerSetting {
    imageList: string[],
    setImageList: (imageList: string[]) => void,
    abortController: AbortController,
    setAbortController: (abortController: AbortController) => void
}

export const useImagePreviewerSetting = create<IImagePreviewerSetting>((set) => ({
    imageList: [],
    setImageList: (imageList: string[]) => set({imageList}),
    abortController: new AbortController(),
    setAbortController: (abortController: AbortController) => set({abortController})
}))