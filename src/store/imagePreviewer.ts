import {create} from 'zustand'
import {IUserInfo} from "@/store/user";
import {IOnParamsRequestFunc} from "@/components/imagePreviewer/useImagePreviewer";

export interface IImageListItem {
    id: string,
    url: string,
    params?: {}
}

interface IImagePreviewerSetting {
    imageList: IImageListItem[],
    setImageList: (imageList: IImageListItem[]) => void,
    imageUser: IUserInfo,
    setImageUser: (imageUser: IUserInfo) => void,
    imageParams: any,
    setImageParams: (key: string | number, partialImageParams: any) => void,
    clearImageParams: () => void,
    imageExtra: any,
    setImageExtra: (imageExtra: any) => void,

    abortController: AbortController,
    setAbortController: (abortController: AbortController) => void,

    onParamsRequest: IOnParamsRequestFunc,
    setOnParamsRequest: (onParamsRequest: IOnParamsRequestFunc) => void,
}

export const useImagePreviewerSetting = create<IImagePreviewerSetting>((set) => ({
    imageList: [],
    setImageList: (imageList: IImageListItem[]) => set({imageList}),
    imageUser: {
        id: -1,
        nickName: '',
        userName: '',
        avatar: '',
        email: ''
    },
    setImageUser: (imageUser: IUserInfo) => set({imageUser}),
    imageParams: {},
    setImageParams: (key: string | number, partialImageParams: any) => {
        set(state => ({
            imageParams: {
                ...state.imageParams,
                [key]: partialImageParams
            }
        }))
    },
    clearImageParams: () => set({imageParams: {}}),
    imageExtra: {},
    setImageExtra: (imageExtra: any) => set({imageExtra}),

    abortController: new AbortController(),
    setAbortController: (abortController: AbortController) => set({abortController}),

    onParamsRequest: () => {
    },
    setOnParamsRequest: (onParamsRequest: IOnParamsRequestFunc) => set({onParamsRequest}),
}))