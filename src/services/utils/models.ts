import {IModel} from "@/services/modules/models";
import api from "@/services/export";
import {IPost} from "@/services/modules/posts";
import {getPostBannerUrl} from "@/services/utils/posts";
import {require} from "ace-builds";

/**
 * 异步获取用户额外信息
 *
 * 此函数用于异步获取作者的头像URL
 *
 * @returns 返回一个Promise，表示异步操作已完成
 */
export const getModelUserInfo = (newModel: IModel) => {
    return new Promise((resolve) => {
        if (!newModel.userId)
            return resolve(newModel)

        api.account.getUserInformation(newModel.userId)
            .then((userRes) => {
                const avatarId = userRes.data.data.avatar

                api.staticImage.getUrlByStaticImageId(avatarId)
                    .then((urlRes) => {
                        newModel.userAvatarUrl = urlRes.data.data.url
                        resolve(newModel)
                    })
            })
    })
}

/**
 * 获取模型的横幅图片URL
 *
 * 此函数用于获取指定模型的新横幅图片URL如果模型有对应的横幅图片，则获取该图片的URL；
 * 否则，返回默认的横幅图片URL该函数通过API调用获取模型的相关帖子信息，
 * 并从中提取横幅图片URL
 *
 * @param newModel 新模型对象，包含模型的ID等信息
 * @param defaultBannerUrl 默认的横幅图片URL，当模型没有横幅图片时使用，默认为占位图片URL
 * @returns 返回一个Promise，解析为包含模型横幅图片URL的新模型对象
 */
export const getModelBannerUrl = (
    newModel: IModel,
    defaultBannerUrl: string = require('@/assets/placeholder/noPreview.png')
) => {
    return new Promise((resolve) => {
        // 调用API获取指定模型的帖子信息
        api.posts.getPostLiteByMID({
            modelId: newModel.id,
            page: 1,
            pageSize: 1
        })
            .then(postRes => {
                // 提取帖子信息中的第一个帖子
                const post: IPost = postRes.data.data.list?.[0]

                if (post) {
                    // 获取帖子的横幅图片URL
                    getPostBannerUrl(post)
                        .then((newPost: IPost) => {
                            // 将横幅图片URL设置给模型对象
                            newModel.bannerUrl = newPost.bannerUrl
                            // 解析Promise，返回更新后的模型对象
                            resolve(newModel)
                        })
                } else {
                    // 当没有帖子信息时，使用默认的横幅图片URL
                    newModel.bannerUrl = defaultBannerUrl
                    // 解析Promise，返回更新后的模型对象
                    resolve(newModel)
                }
            })
    })
}


export const getModelsExtraInfo = (
    models: IModel[],
    callbackFn: (models: IModel[]) => void
) => {

    const getExtraInfo = (model: IModel) => {
        let newModel = model

        return new Promise((resolve) => {
            Promise.all([getModelUserInfo(newModel), getModelBannerUrl(newModel)])
                .finally(() => {
                    resolve(newModel)
                })
        })
    }


    let newModels = models
    let promiseList = []

    if (newModels.length !== 0) {
        newModels.forEach((model, index) => {
            promiseList.push(new Promise((resolve) => {
                getExtraInfo(model)
                    .then((newModel) => {
                        newModels[index] = newModel
                        resolve(null)
                    })
            }))
        })

        Promise.all(promiseList)
            .finally(() => {
                callbackFn(newModels)
            })

        return null
    }
}