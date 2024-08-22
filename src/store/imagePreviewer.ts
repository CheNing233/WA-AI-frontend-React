import {create} from 'zustand'
import {IUserInfo} from "@/store/user";

interface IImagePreviewerSetting {
    imageList: string[],
    setImageList: (imageList: string[]) => void,
    imageParams: any,
    setImageParams: (imageParams: any) => void,
    imageUser: IUserInfo,
    setImageUser: (imageUser: IUserInfo) => void,
    abortController: AbortController,
    setAbortController: (abortController: AbortController) => void
}

export const useImagePreviewerSetting = create<IImagePreviewerSetting>((set) => ({
    imageList: [],
    setImageList: (imageList: string[]) => set({imageList}),
    imageParams: {},
    setImageParams: (imageParams: any) => set({imageParams}),
    imageUser: {
        id: -1,
        nickName: '',
        userName: '',
        avatar: '',
        email: ''
    },
    setImageUser: (imageUser: IUserInfo) => set({imageUser}),
    abortController: new AbortController(),
    setAbortController: (abortController: AbortController) => set({abortController})
}))