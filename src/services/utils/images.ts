import api from "@/services/export";
import {IImageListItem} from "@/store/imagePreviewer";


// 将图片ID数组转换为图片对象数组的函数
// 此函数用于将一系列静态图片ID转换成对应的图片URL，并以对象的形式存储这些图片信息
export const sdImageIdList2objList = (
    // 图片ID数组，这些ID将用于请求图片URL
    sdImageIdList: string[],
    // 在动态解析图片URL过程中调用的回调函数，用于处理中间结果
    onDynamicResolve?: (newList: IImageListItem[]) => void,
    // 在所有图片URL解析完成后调用的回调函数，用于处理最终结果
    onResolve?: (newList: IImageListItem[]) => void
) => {
    // 初始化一个新的数组，用于存储图片对象
    const newList: IImageListItem[] = [];

    // 对每个图片ID发起异步请求，获取对应的图片URL
    const promises = sdImageIdList.map((id, index) => {
        return new Promise((resolve) => {
            // 调用API获取指定图片ID的URL
            api.staticImage.getUrlByStaticImageId(id)
                .then(res => {
                    // 将获取到的图片URL与图片ID组合成对象，并替换原数组中的图片ID
                    newList[index] = {
                        id: id,
                        url: res.data.data.url
                    }
                    // 如果提供了动态解析回调函数且当前图片ID有效，则调用该回调函数传递当前解析结果
                    if (onDynamicResolve && id && res.data.data.url) {
                        onDynamicResolve(newList)
                    }
                })
                .finally(() => {
                    // 解析完成后，解决当前Promise
                    resolve(null)
                })
        })
    })

    // 等待所有图片URL请求完成
    Promise.all(promises).finally(() => {
        // 所有图片URL解析完成后，如果提供了解析完成回调函数，则调用该回调函数传递最终结果
        onResolve && onResolve(newList)
    })
}

