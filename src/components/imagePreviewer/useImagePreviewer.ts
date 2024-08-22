import {useContext} from "react";
import {GlobalContext} from '@/context';
import {useImagePreviewerSetting} from "@/store/imagePreviewer";
import {IUserInfo} from "@/store/user";

export type IWorkbench = {
    imageViewerShow: boolean,
    setImageViewerShow: (
        visible: boolean,
        onRequest?: (
            resolve: (
                imageList?: string[],
                imageUser?: IUserInfo,
                imageParams?: any
            ) => void,
            abortController: AbortController
        ) => void) => void
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
        setImageList, setImageUser, setImageParams,
        abortController, setAbortController
    ] = useImagePreviewerSetting(
        (state) => [
            state.setImageList, state.setImageUser, state.setImageParams,
            state.abortController, state.setAbortController
        ]
    )

    /**
     * 设置图片预览器的显示状态
     *
     * @param {boolean} visible - 图片预览器的可见性
     * @param {function} onRequest - 可选的回调函数，用于在显示请求前后执行自定义逻辑
     */
    const setImageViewerShow = (
        visible: boolean,
        onRequest?: (
            resolve: (imageList?: string[]) => void,
            abortController: AbortController
        ) => void,
    ) => {
        // 定义一个处理函数，用于设置图片列表
        const handleResolve = (
            imageList?: string[],
            imageUser?: IUserInfo,
            imageParams?: any
        ) => {
            if (imageList) {
                setImageList(imageList)
            }
            if (imageUser) {
                setImageUser(imageUser)
            }
            if (imageParams) {
                setImageParams(imageParams)
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
    }

    // 返回图片预览器的显示状态和设置显示状态的方法
    return {imageViewerShow: imageViewerVisible, setImageViewerShow: setImageViewerShow}
}


export default useImagePreviewer