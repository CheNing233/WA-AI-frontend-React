import {IPost} from "@/services/modules/posts";
import api from "@/services/export";


/**
 * 异步获取用户额外信息
 *
 * 此函数用于异步获取帖子作者的头像URL
 *
 * @returns 返回一个Promise，表示异步操作已完成
 */
export const getPostUserInfo = (newPost: IPost) => {
    return new Promise((resolve) => {
        api.account.getUserInformation(newPost.userId)
            .then((userRes) => {
                const avatarId = userRes.data.data.avatar

                api.staticImage.getUrlByStaticImageId(avatarId)
                    .then((urlRes) => {
                        newPost.userAvatarUrl = urlRes.data.data.url
                        resolve(newPost)
                    })
            })
    })
}

/**
 * 异步获取帖子额外信息
 *
 * 此函数用于异步获取帖子的封面URL
 *
 * @returns 返回一个Promise，表示异步操作已完成
 */
export const getPostBannerUrl = (newPost: IPost) => {
    return new Promise((resolve, reject) => {
        api.staticImage.getUrlByStaticImageId(newPost.sdimageIdList[0])
            .then((urlRes) => {
                newPost.bannerUrl = urlRes.data.data.url
                resolve(newPost)
            })
    })
}


/**
 * 获取帖子的额外信息
 *
 * 此函数接收一个帖子数组和一个回调函数作为参数，用于获取每个帖子的额外信息，并在所有帖子信息获取完毕后通过回调函数返回更新后的帖子数组
 *
 * @param posts 帖子数组，包含要获取额外信息的帖子
 * @param callbackFn 回调函数，当所有帖子的额外信息获取完毕后被调用，接收更新后的帖子数组作为参数
 * @returns 无返回值
 */
export const getPostsExtraInfo = (
    posts: IPost[],
    callbackFn: (posts: IPost[]) => void
) => {

    /**
     * 获取单个帖子的额外信息
     *
     * 此函数用于获取单个帖子的额外信息，包括用户头像URL和帖子封面URL
     *
     * @param post 帖子对象，用于获取其额外信息
     * @returns 返回一个Promise，解析为包含额外信息的帖子对象
     */
    const getExtraInfo = (post: IPost) => {
        let newPost = post

        return new Promise((resolve) => {
            Promise.all([getPostUserInfo(newPost), getPostBannerUrl(newPost)])
                .finally(() => {
                    resolve(newPost)
                })
        })
    }

    let newPosts = posts
    let promiseList = []

    if (newPosts.length !== 0) {
        newPosts.forEach((post, index) => {
            promiseList.push(new Promise((resolve) => {
                getExtraInfo(post)
                    .then((newPost) => {
                        newPosts[index] = newPost
                        resolve(null)
                    })
            }))
        })

        Promise.all(promiseList)
            .finally(() => {
                callbackFn(newPosts)
            })

        return null
    }
}
