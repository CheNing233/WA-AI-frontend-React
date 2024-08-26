import {IUserInfo} from "@/store/user";
import api from "@/services/export";

export const getUserAvatar = (userInfo: IUserInfo, callbackFn: (userInfo: IUserInfo) => void) => {
    userInfo.avatarUrl = null

    if (userInfo && userInfo.avatar) {
        // 通过头像ID获取头像URL
        api.staticImage.getUrlByStaticImageId(userInfo.avatar)
            .then((avatarRes) => {
                // 更新用户信息中的头像URL
                userInfo.avatarUrl = avatarRes.data.data.url
                // 设置用户信息
                callbackFn(userInfo)
            })
    } else {
        callbackFn(userInfo)
    }
}