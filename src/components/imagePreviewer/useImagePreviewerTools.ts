import {IPost} from "@/services/modules/posts";
import {loadingMessage} from "@/utils/loadingMessage";
import {sdImageIdList2objList} from "@/services/utils/images";
import api from "@/services/export";
import {getUserAvatar} from "@/services/utils/account";
import useImagePreviewer from "@/components/imagePreviewer/useImagePreviewer";

interface IUseImagePreviewerTools {
    openPost: (post: IPost) => void
}

const useImagePreviewerTools = (): IUseImagePreviewerTools => {
    const {setImageViewerShow} = useImagePreviewer()

    const openPost = (post: IPost) => {
        setImageViewerShow(
            true,
            (resolve, abortController) => {
                resolve(null, null, {
                    updateTime: post.updateTime,
                })

                loadingMessage(
                    'msg.image.previewer',
                    '正在全力加载喵~',
                    (msgResolve) => {
                        sdImageIdList2objList(
                            post.sdimageIdList,
                            (imageList) => {
                                if (!abortController.signal.aborted) {
                                    if (imageList.length === 1) {
                                        resolve(new Array(...imageList))
                                    }
                                    msgResolve(
                                        'waiting',
                                        `正在全力加载喵...(${imageList.length}/${post.sdimageIdList.length})`
                                    )
                                }
                            },
                            (imageList) => {
                                if (!abortController.signal.aborted)
                                    resolve(imageList)
                                msgResolve(true, '加载完成喵~')
                            }
                        )
                    }
                )

                api.account.getUserInformation(post.userId)
                    .then(userInfoRes => {
                        getUserAvatar(
                            userInfoRes.data.data,
                            (u) => {
                                if (!abortController.signal.aborted)
                                    resolve(null, u)
                            })
                    })
            },
            (imageItem, imageIndex, resolve, abortController) => {
                api.images.getById(imageItem.id)
                    .then(imageInfoRes => {
                        if (!abortController.signal.aborted) {
                            const paramsObj = JSON.parse(imageInfoRes.data.data.params)
                            resolve(paramsObj, imageIndex)
                        }
                    })
            }
        )
    }


    return {
        openPost,
    }
}

export default useImagePreviewerTools