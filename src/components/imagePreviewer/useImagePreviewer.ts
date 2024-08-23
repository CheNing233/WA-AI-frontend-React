import {useContext} from "react";
import {GlobalContext} from '@/context';
import {IImageListItem, useImagePreviewerSetting} from "@/store/imagePreviewer";
import {IUserInfo} from "@/store/user";

export interface IOnRequestResolveFunc {
    (
        imageList?: IImageListItem[],
        imageUser?: IUserInfo,
        imageExtraInfo?: any
    ): void
}

export interface IOnRequestFunc {
    (
        resolve: IOnRequestResolveFunc,
        abortController: AbortController
    ): void
}

export interface IOnParamsRequestFunc {
    (
        imageItem: IImageListItem,
        imageIndex: number | string,
        resolve: (params: any, index: number | string) => void,
        abortController: AbortController
    )
}

export interface setImageViewerShowFunc {
    (
        visible: boolean,
        onRequest?: IOnRequestFunc,
        onParamsRequest?: IOnParamsRequestFunc,
    ): void
}

export interface IWorkbench {
    imageViewerShow: boolean,
    setImageViewerShow: setImageViewerShowFunc
}

/**
 * 使用图片预览器的钩子函数
 * 该钩子函数用于管理图片预览器的显示状态和图片列表
 *
 * @returns {IWorkbench} 返回一个对象，包含图片预览器的显示状态和设置显示状态的方法
 */
const useImagePreviewer = (): IWorkbench => {
    // 从全局上下文中获取图片查看器的可见性状态和设置可见性的函数
    const {imageViewerVisible, setImageViewerVisible} = useContext(GlobalContext);
    // 使用useImagePreviewerSetting钩子函数来获取图片列表设置、AbortController及相关设置函数
    const [
        setImageList, setImageUser, setImageExtra,
        abortController, setAbortController,
        setOnParamsRequest
    ] = useImagePreviewerSetting(
        (state) => [
            state.setImageList, state.setImageUser, state.setImageExtra,
            state.abortController, state.setAbortController,
            state.setOnParamsRequest
        ]
    )

    // 设置图片预览器显示状态的函数
    const setImageViewerShow: setImageViewerShowFunc = (
        visible,
        onRequest,
        onParamsRequest
    ) => {
        // 定义一个处理函数，用于设置图片列表
        const handleResolve: IOnRequestResolveFunc = (
            imageList, imageUser, imageExtraInfo
        ) => {
            if (imageList) {
                setImageList(imageList)
            }
            if (imageUser) {
                setImageUser(imageUser)
            }
            if (imageExtraInfo) {
                setImageExtra(imageExtraInfo)
            }
        }

        // 设置图片预览器的可见性
        setImageViewerVisible(visible);

        // 如果预览器不显示，则中止当前请求并设置新的AbortController
        if (!visible) {
            abortController.abort()
            setAbortController(new AbortController())
        }

        // 如果提供了onRequest回调函数，则调用它，传入handleResolve和当前的AbortController
        if (onRequest) {
            onRequest(handleResolve, abortController)
        }

        if (onParamsRequest) {
            setOnParamsRequest(onParamsRequest)
        }
    }

    // 返回图片预览器的显示状态和设置显示状态的方法
    return {
        imageViewerShow: imageViewerVisible,
        setImageViewerShow: setImageViewerShow
    }
}

export default useImagePreviewer;
